# Contributing

Thanks for your interest in contributing to **RACON** — your help is appreciated!
This guide is concise, safe, and actionable to make collaboration straightforward.

---

## Quick Summary
- Fork the repo → create a branch → make small focused changes → open a Pull Request to `main`.
- Follow code style, add tests when applicable, and provide clear PR descriptions.

## Getting Started
1. Fork the repository and clone it: `git clone https://github.com/<username>/RACON.git`
2. Create a branch for your work: `git checkout -b feat/yourname-short-description` or `fix/yourname-short-description`.
3. Make changes, add tests, and run available linters/tests:
   - Example: `npm install` then `npm test` or `npm run lint` (if available).
4. Push your branch and open a Pull Request to `main` with a detailed description.

## Branch & Commit Naming
- Branches: `feat/...`, `fix/...`, `docs/...`, `refactor/...`, `chore/...`.
- Keep commit messages clear and consistent. Conventional Commits are recommended: `feat:`, `fix:`, `docs:`.

## Reporting Bugs
When opening an issue, include:
- A short title
- Description & reproduction steps
- Extension version / browser / OS
- Expected vs actual results
- Screenshots / logs if available

## Proposing Features
Explain the problem, example use case, and suggested design (optional: include a small POC).

## Security Disclosure (IMPORTANT)
- For sensitive vulnerabilities: use **GitHub Security Advisory** or open an issue labeled `security` and prefix the title with `[SECURITY]`; maintainers will follow up privately.
- Do not publish exploit details until a fix is available.
- If possible, include minimal proof-of-concept and reproduction steps, but avoid harmful exploitation.

## Pull Request Checklist
Before opening a PR, ensure:
- [ ] The branch contains a single logical change
- [ ] Tests are added or updated (when relevant)
- [ ] Linting & formatting have been run
- [ ] PR description is clear + links the issue (if any)
- [ ] Screenshots / example outputs included for UI changes

## Testing & CI
- If the repo has tests/CI, ensure all tests pass before submitting.
- If no automated tests exist, provide manual testing steps you performed.

## Review & Merge
- Maintainers will review and may request changes.
- Once approved and CI passes, PRs will be merged (squash or merge per maintainer policy).

## Code of Conduct
- Be respectful, professional, and inclusive.
- No harassment, discrimination, or abusive language.
- Report violations to the maintainers.

## Contact
- Maintainer: [BangAguse](https://github.com/BangAguse)
- For general questions, open an issue or mention the maintainer in a PR.

## License
By contributing, you agree your contributions will be licensed under the project **MIT License**.

---

Thanks for helping make RACON better — your contributions are valued! 🎉
