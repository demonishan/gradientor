# GitHub Push Protocol Rulebook

## Step-by-Step Protocol for Pushing Code to GitHub

1. **Update Version in package.json**
   - Before deploying, update the "version" field in package.json to reflect the new release.
   - Use semantic versioning. e.g., 1.0.1 → 1.0.2, 1.0.9 → 1.1.0

2. **Run ESLint**
   - Command: `npx eslint . --ext .js,.jsx,.ts,.tsx,.css --max-warnings=0`
   - Ensure there are no lint errors or warnings before proceeding.

3. **Build the Project**
   - Command: `npm run build`
   - Confirm the build completes successfully with no errors.

4. **Stage All Changes**
   - Command: `git add .`
   - Stage all modified, deleted, and new files for commit.

5. **Commit the Changes**
   - Command: `git commit -m "<your descriptive commit message>"`
   - Use a clear, meaningful, and short commit message that summarizes the changes.

6. **Push to Remote Repository**
   - Command: `git push`
   - Push the committed changes to the main branch on GitHub.

7. **Deploy to GitHub Pages**
   - Command: `npm run deploy` (or the appropriate command for your project)
   - Ensure the latest build is published to GitHub Pages.

---

**Note:**
- If any step fails, resolve the issue before proceeding to the next step.
- Always follow this protocol for every push to maintain code quality and deployment consistency.

**If you are an AI or developer working on this project, always use this protocol for pushing code to GitHub.**