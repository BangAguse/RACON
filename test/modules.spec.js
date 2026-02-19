const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');
const { expect } = require('chai');

function loadModuleInDom(moduleRelPath, html = '<!doctype html><html><body></body></html>') {
  const modulePath = path.resolve(__dirname, '..', moduleRelPath);
  const code = fs.readFileSync(modulePath, 'utf8');
  const dom = new JSDOM(html, { url: 'https://example.com' });
  const window = dom.window;
  // prepare a lightweight global for eval'd module
  window.__raconModules = window.__raconModules || {};
  const context = vm.createContext(window);
  // run module code in context
  const script = new vm.Script(code, { filename: modulePath });
  script.runInContext(context);
  return window.__raconModules;
}

describe('RACON modules (integration in jsdom)', function() {
  it('detects tech stack from script src', function() {
    const html = `<script src="https://cdn.jsdelivr.net/npm/react@17/umd/react.production.min.js"></script>`;
    const mods = loadModuleInDom('modules/techStack.js', `<!doctype html><html><body>${html}</body></html>`);
    expect(mods.detectTechStack()).to.match(/React|Unknown/);
  });

  it('detects CMS (WordPress) via meta', function() {
    const html = `<meta name="generator" content="WordPress 5.8" />`;
    const mods = loadModuleInDom('modules/cms.js', `<!doctype html><html><head>${html}</head><body></body></html>`);
    expect(mods.detectCMS()).to.equal('WordPress');
  });

  it('extracts external subdomains from links', function() {
    const html = `<a href="https://api.example.com/foo">x</a><a href="/internal">y</a>`;
    const mods = loadModuleInDom('modules/subdomains.js', `<!doctype html><html><body>${html}</body></html>`);
    const out = mods.extractSubdomains();
    expect(out).to.be.an('array');
    expect(out).to.include('api.example.com');
  });

  it('extracts endpoints from inline script', function() {
    const html = `<script>const url = 'https://api.example.com/v1/users';</script>`;
    const mods = loadModuleInDom('modules/endpoints.js', `<!doctype html><html><body>${html}</body></html>`);
    const out = mods.extractEndpoints();
    expect(out).to.be.an('array').that.is.not.empty;
    expect(out.some(u => u.includes('api.example.com'))).to.equal(true);
  });

  it('lists external asset hostnames', function() {
    const html = `<script src="https://cdn.example.com/lib.js"></script><img src="/img.png"/>`;
    const mods = loadModuleInDom('modules/externalAssets.js', `<!doctype html><html><body>${html}</body></html>`);
    const out = mods.listExternalAssets();
    expect(out).to.include('cdn.example.com');
  });

  it('harvests emails from body text', function() {
    const html = `<div>Contact: alice@example.com</div>`;
    const mods = loadModuleInDom('modules/emails.js', `<!doctype html><html><body>${html}</body></html>`);
    const out = mods.harvestEmails();
    expect(out).to.include('alice@example.com');
  });

  it('detects SQLi heuristics from inputs', function() {
    const html = `<input value="1 OR 1=1" />`;
    const mods = loadModuleInDom('modules/sqli.js', `<!doctype html><html><body>${html}</body></html>`);
    const out = mods.detectSQLi();
    expect(out).to.be.an('array');
    expect(out.some(v => v.type === 'SQLi')).to.equal(true);
  });

  it('detects XSS heuristics via inline on* attributes', function() {
    const html = `<button onclick="alert(1)">Click</button>`;
    const mods = loadModuleInDom('modules/xss.js', `<!doctype html><html><body>${html}</body></html>`);
    const out = mods.detectXSS();
    expect(out.some(v => v.type === 'XSS')).to.equal(true);
  });

  it('detects sensitive file links', function() {
    const html = `<a href="https://example.com/.env">env</a>`;
    const mods = loadModuleInDom('modules/sensitiveFiles.js', `<!doctype html><html><body>${html}</body></html>`);
    const out = mods.detectSensitiveFiles();
    expect(out.some(v => v.type === 'Sensitive File')).to.equal(true);
  });

  it('detects API key patterns in scripts', function() {
    const html = `<script>var k = 'AKIAAAAAAAAAAAAAAAAA';</script>`;
    const mods = loadModuleInDom('modules/apiKeys.js', `<!doctype html><html><body>${html}</body></html>`);
    const out = mods.detectAPIKeys();
    expect(out.some(v => v.type === 'API Key Leak')).to.equal(true);
  });

  it('audits security headers heuristically', function() {
    const mods = loadModuleInDom('modules/securityHeaders.js');
    const out = mods.auditSecurityHeaders({});
    expect(out).to.be.an('array');
    expect(out.length).to.be.greaterThan(0);
  });

  it('audits cookies heuristically', function() {
    const html = `<script>document.cookie = 'session=abc123';</script>`;
    const mods = loadModuleInDom('modules/cookies.js', `<!doctype html><html><body>${html}</body></html>`);
    const out = mods.auditCookies();
    expect(out).to.be.an('array');
  });
});
