#!/usr/bin/env node

import { launch } from 'cloakbrowser';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create the MCP server instance
const server = new McpServer({
  name: "cloak-search-mcp",
  version: "1.1.0",
});

// Helper function to scrape DuckDuckGo
async function scrapeDuckDuckGo(page, query) {
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  console.error(`[DuckDuckGo] Navigating to: ${searchUrl}`);
  
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout?.(1000) || new Promise(resolve => setTimeout(resolve, 1000));

  const results = await page.evaluate(() => {
    const items = [];
    const elements = document.querySelectorAll('.result');
    elements.forEach(el => {
      const titleEl = el.querySelector('.result__title a.result__a');
      const snippetEl = el.querySelector('.result__snippet');
      if (titleEl) {
        let url = titleEl.getAttribute('href') || '';
        if (url.startsWith('//')) {
          url = 'https:' + url;
        }
        if (url.includes('uddg=')) {
          try {
            const urlObj = new URL(url);
            const uddg = urlObj.searchParams.get('uddg');
            if (uddg) {
              url = decodeURIComponent(uddg);
            }
          } catch (e) {
            // Keep original if parsing fails
          }
        }
        items.push({
          title: titleEl.innerText.trim(),
          url: url,
          snippet: snippetEl ? snippetEl.innerText.trim() : ''
        });
      }
    });
    return items;
  });

  return results;
}

// Helper function to scrape Google using simulated human interaction
async function scrapeGoogle(page, query) {
  console.error("[Google] Navigating to Google Homepage...");
  await page.goto("https://www.google.com", { waitUntil: 'networkidle' });

  const selector = 'textarea[name="q"], input[name="q"]';
  await page.waitForSelector(selector);
  await page.click(selector);

  console.error(`[Google] Typing query: "${query}"`);
  await page.type(selector, query, { delay: 100 });
  await page.keyboard.press('Enter');

  console.error("[Google] Waiting for results to load...");
  await Promise.race([
    page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
    page.waitForSelector('h3', { timeout: 10000 }).catch(() => {})
  ]);

  const results = await page.evaluate(() => {
    const items = [];
    const h3Elements = document.querySelectorAll('h3');
    
    h3Elements.forEach(h3 => {
      const a = h3.closest('a') || h3.querySelector('a') || h3.parentElement?.querySelector('a');
      if (a) {
        const title = h3.innerText.trim();
        const url = a.getAttribute('href');
        
        // Filter out Google-specific redirects and services
        if (url && url.startsWith('http') && !url.includes('google.com/search') && !url.includes('google.com/webhp')) {
          let snippet = '';
          const container = h3.closest('.g') || h3.parentElement?.parentElement?.parentElement?.parentElement;
          if (container) {
            const snippetEl = container.querySelector('.VwiC3b') || 
                              container.querySelector('[style*="-webkit-line-clamp"]') ||
                              container.querySelector('.yDAB2d');
            if (snippetEl) {
              snippet = snippetEl.innerText.trim();
            } else {
              const descriptionBlocks = Array.from(container.querySelectorAll('span, div'))
                .map(el => el.innerText ? el.innerText.trim() : '')
                .filter(text => text.length > 40 && text.length < 250 && !text.includes(title));
              if (descriptionBlocks.length > 0) {
                snippet = descriptionBlocks[0];
              }
            }
          }
          
          if (!items.some(item => item.url === url)) {
            items.push({ title, url, snippet });
          }
        }
      }
    });
    
    return items;
  });

  return results;
}

// Register the search_web tool
server.tool(
  "search_web",
  "Performs a web search using a headless browser and returns the top titles, URLs, and snippets.",
  {
    query: z.string().describe("The search query to look up on the web"),
    engine: z.enum(["google", "duckduckgo"])
      .optional()
      .default("google")
      .describe("The search engine to use (default: google, fallback: duckduckgo)"),
  },
  async ({ query, engine = "google" }) => {
    console.error(`Received search request: "${query}" using ${engine}`);
    let browser;
    try {
      browser = await launch({
        headless: true,
        humanize: true,
      });

      const page = await browser.newPage();
      page.setDefaultTimeout(30000);
      await page.setViewportSize({ width: 1280, height: 800 });

      let results = [];
      let usedFallback = false;

      if (engine === "google") {
        try {
          results = await scrapeGoogle(page, query);
          if (results.length === 0) {
            console.error("[Google] No results returned (possible CAPTCHA/block). Falling back to DuckDuckGo...");
            results = await scrapeDuckDuckGo(page, query);
            usedFallback = true;
          }
        } catch (googleError) {
          console.error("[Google] Error occurred. Falling back to DuckDuckGo...", googleError);
          results = await scrapeDuckDuckGo(page, query);
          usedFallback = true;
        }
      } else {
        results = await scrapeDuckDuckGo(page, query);
      }

      console.error(`Scraped ${results.length} results.`);
      await browser.close();

      if (results.length === 0) {
        return {
          content: [{ type: "text", text: "No results found. Both Google and DuckDuckGo returned 0 results or were blocked." }]
        };
      }

      const engineName = usedFallback ? "DuckDuckGo (Google fallback)" : (engine === "google" ? "Google" : "DuckDuckGo");
      const formattedResults = results.slice(0, 8).map((r, i) => {
        return `[Result ${i + 1}]
Title: ${r.title}
URL: ${r.url}
Snippet: ${r.snippet}
`;
      }).join('\n---\n\n');

      return {
        content: [{
          type: "text",
          text: `Search Results (Engine: ${engineName})\n\n${formattedResults}`
        }]
      };
    } catch (error) {
      console.error("Error during search execution:", error);
      if (browser) {
        try {
          await browser.close();
        } catch (e) {
          console.error("Error closing browser:", e);
        }
      }
      return {
        content: [{ type: "text", text: `Error executing search: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Establish connection using standard I/O transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CloakBrowser Search MCP server running on Stdio.");
}

main().catch((err) => {
  console.error("Fatal error in main:", err);
  process.exit(1);
});
