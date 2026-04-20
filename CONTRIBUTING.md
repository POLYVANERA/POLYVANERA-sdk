# Contributing to POLYVANERA SDK

Thank you for your interest in contributing to the POLYVANERA SDK! We welcome contributions from the community.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion for improvement:

1. Check if the issue already exists in our [issue tracker](https://github.com/POLYVANERA/POLYVANERA-sdk)
2. If not, create a new issue with a clear description
3. Include reproduction steps for bugs
4. Provide environment details (Node.js version, OS, etc.)

### Submitting Pull Requests

1. **Fork the repository** and create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, documented code
   - Follow the existing code style
   - Add JSDoc comments for public APIs
   - Update tests if applicable

3. **Test your changes**:
   ```bash
   npm run build
   npm run examples:list
   ```

4. **Commit your changes**:
   - Use clear, descriptive commit messages
   - Reference issue numbers if applicable

5. **Push to your fork** and create a Pull Request:
   - Provide a clear description of the changes
   - Explain the motivation and context
   - Link to any related issues

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm or POLYVANERA

### Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/POLYVANERA-sdk.git
   cd POLYVANERA-sdk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Run examples to verify everything works:
   ```bash
   npm run examples:list
   ```

## Code Style

- Use TypeScript for all source code
- Follow the existing code formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and single-purpose

## Testing

Before submitting a PR:

1. Ensure the project builds without errors:
   ```bash
   npm run build
   ```

2. Test the examples:
   ```bash
   npm run examples:list
   ```

3. Manually test any new functionality

## Documentation

When adding new features:

- Update the README.md if the public API changes
- Add JSDoc comments to all public functions and types
- Update CHANGELOG.md with your changes
- Include code examples where helpful

## Questions?

If you have questions about contributing, feel free to:

- Open an issue for discussion
- Reach out on X (Twitter): [@polyvaneraxyz](https://x.com/POLYVANERAxyz)
- Visit our website: [polyvanera.xyz](polyvanera.xyz)

## Code of Conduct

We expect all contributors to be respectful and professional. Please:

- Be welcoming and inclusive
- Respect differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

## License

By contributing to POLYVANERA SDK, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make POLYVANERA SDK better! 🚀
