<div align="center">
  <img src="icons/raccoon.svg" alt="RACON Logo" width="360">
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Version-0.1.0-brightgreen" />
  <img src="https://img.shields.io/badge/Language-JavaScript-yellow" />
  <img src="https://img.shields.io/badge/Type-Chrome%20Extension-blue" />
  <img src="https://img.shields.io/badge/Open%20Source-Yes-brightgreen" />
  <img src="https://img.shields.io/badge/Maintained-Yes-2ea44f" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
  <a href="https://github.com/BangAguse">
    <img src="https://img.shields.io/badge/Author-Muh.%20Agus%20Tri%20Ananda-red" />
  </a>
</p>

# RACON

_The Stealthy Bandit Recon_  
Lightweight Chrome Extension for Web Reconnaissance & Security Awareness

---

## What is RACON?

RACON (The Stealthy Bandit Recon) is a Chrome extension designed for lightweight web reconnaissance and quick detection of potential security issues directly from the browser.

RACON follows a **defensive-first** approach:
- No active exploitation
- No sending of harmful payloads
- No modification of target systems
- No brute-force or automated attacks

All operations are performed using:
- public information
- browser responses
- client-side configuration
- and artifacts intentionally exposed to users

RACON is a practical, read-only reconnaissance tool — not a simulation or falsified analysis.

---

## Disclaimer

RACON is intended for education, self-audit, and raising web security awareness. Use without explicit authorization from the system owner or for illegal activities is strictly the user's responsibility.

Use only on systems that you own, manage, or have written permission to audit.

---

## Background & Goals

Many web security incidents are caused by misconfiguration, exposed information, or basic oversights — not advanced exploits.

RACON aims to provide fast visibility into an application's attack surface without heavy tools, leaving the browser, or moving into active exploitation.

Primary goals:
- Help early-stage recon safely
- Increase awareness for developers & security teams
- Ease light audits before deeper testing
- Provide an educational, transparent tool

RACON is not an exploit framework — it is an observation tool.

---

## Features

RACON provides 12 main modules:

1. Tech Stack Detection — Identify frameworks, libraries, and technologies.
2. CMS Detection — Detect common CMS (e.g., WordPress).
3. Subdomain Enumeration — Collect publicly-known subdomains.
4. Endpoint Discovery — Find API endpoints and internal URLs.
5. External Assets Listing — List third-party domains and services.
6. Email Extraction — Extract exposed public email addresses.
7. SQL Injection Indicator — Identify potential SQL injection patterns (non-exploitative).
8. XSS Indicator — Find potential XSS sinks and reflected inputs.
9. Sensitive Files Check — Check for presence of sensitive files (`.env`, `.git`, `.bak`, etc.).
10. API Key Detection — Detect possible client-side API key leaks.
11. Security Headers Audit — Audit headers (CSP, HSTS, X-Frame-Options, etc.).
12. Cookie Security Audit — Analyze cookie attributes (`HttpOnly`, `Secure`, `SameSite`).

All modules are read-only and non-intrusive.

---

## Installation

1. Clone or download the repository.
2. Open Chrome and go to:
```
chrome://extensions/
```
3. Enable **Developer Mode**.
4. Click **Load unpacked**.
5. Select the **RACON** folder.
6. The extension is ready to use.

---

## Usage

1. Visit a target website.
2. Click the **RACON** icon in the Chrome toolbar.
3. Run the desired module(s).
4. Review the displayed results.
5. Use results for audits, documentation, or learning.

---

## Support & Donations

If you find RACON useful, consider supporting its development via donation.

<p align="center">
  <img src="https://i.ibb.co.com/21mcgrL6/Untitled-design-20251229-042141-0000.png" alt="DANA Logo" width="140"><br>
  <b>DANA:</b> 085756444803
</p>

Your support helps keep the project maintained and improved.

---

## License

This project is released under the **MIT License**.

---

<p align="center">
🦝 <b>Recon smart. Stay stealthy.</b><br>
Built by <a href="https://github.com/BangAguse"><b>Muh. Agus Tri Ananda</b></a>
</p>
