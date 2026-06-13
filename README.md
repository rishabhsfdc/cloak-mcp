# CloakBrowser Search MCP

A 100% local, anti-bot-resilient web search Model Context Protocol (MCP) server utilizing `cloakbrowser` (a stealth Chromium automation tool).

## Features
- **Dual Search Engines:** Search Google (default) or DuckDuckGo.
- **Stealth Interaction:** Google searches simulate natural human behavior (typing speed, keyboard navigation, and viewport configurations) to completely bypass CAPTCHAs and bot blocks.
- **Self-Healing Fallback:** Automatically switches to DuckDuckGo if Google blocks requests, ensuring 100% reliable results.
- **Zero API Keys:** Free, local, and private scraping.

## Installation

### Local Install (Developer Setup)
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

Start the server using:
```bash
node index.js
```
*(On first execution, `cloakbrowser` will automatically download its stealth Chromium binary ~535 MB).*

## Client Configuration

Add this server to your MCP client (such as Claude Desktop or Cursor).

### Claude Desktop
Add to `%APPDATA%\Claude\claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "cloak-search-mcp": {
      "command": "node",
      "args": ["/path/to/cloak-search-mcp/index.js"]
    }
  }
}
```

### Cursor
Add a new MCP server in **Settings -> Features -> MCP**:
- **Name:** `cloak-search-mcp`
- **Type:** `command`
- **Command:** `node /path/to/cloak-search-mcp/index.js`
