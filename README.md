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

### 1. Cursor Setup

1. Register the MCP server in **Settings -> Features -> MCP**:
   - **Name:** `cloak-search-mcp`
   - **Type:** `command`
   - **Command:** `npx -y cloak-search-mcp`

2. To route Cursor to your local LLM:
   - Go to **Settings -> Models**.
   - Under **OpenAI API Key**, enter a dummy key (e.g., `sk-no-key-required`).
   - Click **Configure** and set **Override Base URL** to:
     * **Llama.cpp:** `http://localhost:8080/v1`
     * **Ollama:** `http://localhost:11434/v1`
   - Add your local model name (e.g., `default_model` or `llama3`) and disable Cursor's default cloud models.

### 2. Copilot CLI Setup

1. Set environment variables to route Copilot CLI to your local LLM:

   * **PowerShell (Llama.cpp):**
     ```powershell
     $env:COPILOT_PROVIDER_BASE_URL="http://127.0.0.1:8080"
     $env:COPILOT_OFFLINE="true"
     $env:COPILOT_MODEL="default_model"
     ```
   * **PowerShell (Ollama):**
     ```powershell
     $env:COPILOT_PROVIDER_BASE_URL="http://127.0.0.1:11434/v1"
     $env:COPILOT_OFFLINE="true"
     $env:COPILOT_MODEL="llama3" # Replace with your loaded Ollama model
     ```
   * **Bash (Llama.cpp):**
     ```bash
     export COPILOT_PROVIDER_BASE_URL="http://127.0.0.1:8080"
     export COPILOT_OFFLINE="true"
     export COPILOT_MODEL="default_model"
     ```
   * **Bash (Ollama):**
     ```bash
     export COPILOT_PROVIDER_BASE_URL="http://127.0.0.1:11434/v1"
     export COPILOT_OFFLINE="true"
     export COPILOT_MODEL="llama3" # Replace with your loaded Ollama model
     ```

2. Register the MCP server with Copilot CLI:
   ```bash
   copilot mcp add cloak-search-mcp -- npx -y cloak-search-mcp
   ```

### 3. Claude CLI Setup

If running a local Claude CLI session against your local model, set the following environment variables:

* **PowerShell (Llama.cpp):**
  ```powershell
  $env:ANTHROPIC_BASE_URL="http://127.0.0.1:8080"
  $env:ANTHROPIC_AUTH_TOKEN="sk-no-key-required"
  $env:ANTHROPIC_MODEL="default_model"
  ```
* **PowerShell (Ollama):**
  ```powershell
  $env:ANTHROPIC_BASE_URL="http://127.0.0.1:11434/v1"
  $env:ANTHROPIC_AUTH_TOKEN="sk-no-key-required"
  $env:ANTHROPIC_MODEL="llama3" # Replace with your loaded Ollama model
  ```
* **Bash (Llama.cpp):**
  ```bash
  export ANTHROPIC_BASE_URL="http://127.0.0.1:8080"
  export ANTHROPIC_AUTH_TOKEN="sk-no-key-required"
  export ANTHROPIC_MODEL="default_model"
  ```
* **Bash (Ollama):**
  ```bash
  export ANTHROPIC_BASE_URL="http://127.0.0.1:11434/v1"
  export ANTHROPIC_AUTH_TOKEN="sk-no-key-required"
  export ANTHROPIC_MODEL="llama3" # Replace with your loaded Ollama model
  ```

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
