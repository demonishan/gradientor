
# Contributing to Gradientor

Thank you for your interest in contributing! Please follow these guidelines to help us maintain a high-quality, secure, and modern project.

## Workflow

1. **Fork the repository** and create your branch from `main`.
2. **Follow the GitHub Push Protocol** in `RULEBOOK_GITHUB.md` for all code changes:
   - Bump the version in `package.json`.
   - Run ESLint and ensure zero errors/warnings.
   - Build the project and confirm success.
   - Stage, commit, and push with a clear message.
   - Deploy if appropriate.
3. **Keep code minimal and concise**:
   - Use single-line, strictly typed, and MUI-compliant code.
   - Avoid unnecessary comments, whitespace, or variables.
   - Use semicolons and strict typing.
4. **UI/UX**:
   - Use MUI components and follow the app's minimal, responsive design.
   - Use the primary color and font as defined in the theme.
   - Ensure accessibility and mobile usability.
5. **API & Caching**:
   - Integrate with Contentful API for gradient presets.
   - Use local storage caching to minimize API calls and improve performance.
6. **Security**:
   - Never commit API keys, secrets, or credentials. Use environment variables.
   - Review dependencies for security risks and keep them up to date.
   - See SECURITY.md for more details.
7. **Pull Requests**:
   - Reference related issues if any.
   - Describe your changes clearly and concisely.
   - Ensure your branch is up to date with `main` before submitting.

## Code Style

- Use TypeScript strict mode.
- Use functional React components and hooks.
- Prefer hooks over class components.
- Use the app's font and color theme.
- Avoid use of `any` type; use explicit types and interfaces.
- Follow lint/build/push protocol for every commit.

## Communication

- Be respectful and constructive in all discussions.
- Ask questions if unsure about the protocol, design, or security.

Thank you for helping make Gradientor better!
