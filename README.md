# CloakBrowser Search MCP

A 100% local, anti-bot-resilient web search Model Context Protocol (MCP) server utilizing `cloakbrowser` (a stealth Chromium automation tool).

## Features
- **Dual Search Engines:** Search Google (default) or DuckDuckGo.
- **Stealth Interaction:** Google searches simulate natural human behavior (typing speed, keyboard navigation, and viewport configurations) to completely bypass CAPTCHAs and bot blocks.
- **Self-Healing Fallback:** Automatically switches to DuckDuckGo if Google blocks requests, ensuring 100% reliable results.
- **Zero API Keys:** Free, local, and private scraping.

## Quick Start (No Installation Needed)

You can run this server directly via `npx` in your MCP client configurations. 

*(On first execution, `cloakbrowser` will automatically download its stealth Chromium binary ~535 MB in the background).*

### 1. Claude Desktop Setup
Add this to your `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "cloak-search-mcp": {
      "command": "npx",
      "args": ["-y", "cloak-search-mcp"]
    }
  }
}
```

### 2. Cursor Setup
Add a new MCP server in **Settings -> Features -> MCP**:
- **Name:** `cloak-search-mcp`
- **Type:** `command`
- **Command:** `npx -y cloak-search-mcp`

---

## Global Installation (Alternative)

If you prefer to install it globally on your machine:
```bash
npm install -g cloak-search-mcp
```
Then configure your MCP client to run:
- **Command:** `cloak-search-mcp`

---

## Local Development Setup

If you want to modify or run the code locally:
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the server locally:
   ```bash
   node index.js
   ```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
