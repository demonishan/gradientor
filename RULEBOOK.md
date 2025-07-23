# Project Rules for AI Assistant

## Code Style & Standards
- Always use TypeScript strict mode
- Prefer functional programming patterns
- Prefer arrow function
- Single-line arrow functions and conditions should not use brackets
- Single parameter arrow functions should not have brackets around the parameter (e.g., `e => {}` not `(e) => {}`)
- Keep code minimal and concise
- Keep HTML elements on single lines when possible - avoid unnecessary line breaks
- Put all element attributes on one line instead of spreading across multiple lines
- Keep element content inline when short - avoid multi-line formatting for simple content
- No double new lines - use only single line breaks between code blocks
- Always use semicolon

## File Organization
- Keep components, services, and pages in their respective folders
- Use barrel exports (index.ts) for cleaner imports
- Follow the feature-based folder structure

## Comments & Documentation
- Remove unnecessary comments
- Use JSDoc for public APIs
- Keep README files updated

## Testing & Quality
- Run ESLint before committing
- Fix all linting errors
- Ensure responsive design works on mobile and desktop
- Test dark mode functionality

## Accessibility
- Include proper ARIA labels
- Ensure keyboard navigation works
- Maintain good color contrast ratios
- Test with screen readers when possible

Rules for CSS/SCSS are here: RULEBOOK_CSS.md
Rules for Git & Deployment are here: RULEBOOK_GITHUB.md