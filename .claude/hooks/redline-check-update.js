#!/usr/bin/env node
// redline-hook-version: 1.0.0
// Check for Redline updates in background, write result to cache
// Called by SessionStart hook - runs once per session

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const homeDir = os.homedir();
const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(homeDir, '.claude');
const cacheDir = path.join(claudeDir, 'cache');
const cacheFile = path.join(cacheDir, 'redline-update-check.json');
const installedVersionFile = path.join(claudeDir, 'commands', 'redline', 'VERSION');

// Ensure cache directory exists
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Run check in background
const child = spawn(process.execPath, ['-e', `
  const fs = require('fs');
  const https = require('https');

  const cacheFile = ${JSON.stringify(cacheFile)};
  const installedVersionFile = ${JSON.stringify(installedVersionFile)};

  // Read installed version
  let installed = '0.0.0';
  try {
    if (fs.existsSync(installedVersionFile)) {
      installed = fs.readFileSync(installedVersionFile, 'utf8').trim();
    }
  } catch (e) {}

  // Fetch latest version from GitHub raw
  const url = 'https://raw.githubusercontent.com/true-north-stack/redline/main/VERSION';
  https.get(url, { timeout: 10000 }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const latest = data.trim();
      if (!/^[0-9]+\\.[0-9]+\\.[0-9]+/.test(latest)) {
        // Invalid response, skip
        return;
      }
      const result = {
        update_available: latest !== installed,
        installed,
        latest,
        checked: Math.floor(Date.now() / 1000)
      };
      fs.writeFileSync(cacheFile, JSON.stringify(result));
    });
  }).on('error', () => {
    // Network error, skip silently
  });
`], {
  stdio: 'ignore',
  windowsHide: true,
  detached: true
});

child.unref();
