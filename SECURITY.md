
# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Gradientor, please report it privately by emailing the repository owner or opening a private issue on GitHub. Do not disclose security issues publicly until they have been reviewed and patched.

- We will respond as quickly as possible to your report.
- Once the vulnerability is confirmed, we will work to release a fix promptly and credit the reporter if desired.

## Supported Versions

Only the latest version of Gradientor is supported with security updates. Please update to the latest version before reporting issues.

## Best Practices

- **Do not share sensitive information in public issues or pull requests.**
- **Keep dependencies up to date.**
- **Review third-party packages for security risks before use.**
- **Never commit API keys, secrets, or credentials to the repository.**
- **Use environment variables for all sensitive configuration.**
- **Follow the lint/build/push protocol to ensure code quality and reduce risk.**
- **Monitor for vulnerabilities in dependencies using npm audit and GitHub Dependabot.**
- **Patch and disclose vulnerabilities responsibly.**

## API & Data Security

- All API keys and secrets must be stored in environment variables and never hardcoded.
- Contentful and other third-party APIs should use read-only tokens where possible.
- User data is never stored or transmitted to third-party services.

## Dependency Management

- Use only well-maintained, trusted packages.
- Regularly audit dependencies for vulnerabilities.

## Protocol Compliance

- Always follow the push protocol in `RULEBOOK_GITHUB.md` to maintain code quality and deployment safety.

Thank you for helping keep Gradientor and its users safe!
