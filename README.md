# Jira Dashboard Extension

A Chrome extension that shows Jira tasks in a popup dashboard with quick filtering, status views, and a dedicated options page. Built with React + Vite and packaged as a Manifest V3 extension.

## Features

- Popup dashboard for Jira issues and quick filters
- Options page for configuration
- Background service worker for extension logic
- Atlaskit UI components for a consistent Jira-like experience

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Build output goes to `dist/` and includes the packaged extension assets (manifest, background script, icons, popup, options page).

## Release Workflow

The GitHub Actions workflow handles the full release pipeline when a PR is labeled `release`:

- Installs dependencies (`npm ci`)
- Builds the extension (`npm run build`)
- Minifies JS/CSS/HTML in `dist/`
- Reads the version from `dist/manifest.json`
- Creates a `v<version>` tag and GitHub release
- Uploads a zipped `dist` artifact

To cut a release:
1. Bump `manifest.json` version.
2. Open a PR and add the `release` label.
3. The workflow builds, minifies, tags, and publishes a release.
