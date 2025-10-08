# Contributing to ENACT Legal Platform

Thank you for your interest in contributing to ENACT! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative and constructive
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/enact-legal.git`
3. Install dependencies: `npm install`
4. Copy environment variables: `cp .env.example .env`
5. Start development server: `npm run dev`

## 📝 Development Guidelines

### Code Style

We use ESLint and Prettier for code formatting. Please ensure your code follows our style guide:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Commit Messages

Use conventional commit messages:

```
feat: add new legal document template
fix: resolve authentication issue
docs: update API documentation
style: format code with prettier
refactor: simplify error handling logic
test: add unit tests for validation
chore: update dependencies
```

### Branch Naming

Use descriptive branch names:

```
feature/document-generation
bugfix/auth-redirect-issue
hotfix/security-vulnerability
docs/api-documentation
```

## 🧪 Testing

All contributions should include appropriate tests:

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Guidelines

- Write unit tests for utility functions
- Write integration tests for components
- Maintain test coverage above 80%
- Use descriptive test names
- Mock external dependencies

## 📋 Pull Request Process

1. **Create a feature branch** from `develop`
2. **Make your changes** following our guidelines
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Run the full test suite** and ensure it passes
6. **Submit a pull request** with a clear description

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Updated existing tests

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior**
4. **Actual behavior**
5. **Environment details** (OS, browser, Node version)
6. **Screenshots** if applicable

Use our bug report template:

```markdown
**Bug Description**
A clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Node Version: [e.g. 18.17.0]
```

## 💡 Feature Requests

For feature requests, please:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** you're trying to solve
3. **Propose a solution** with implementation details
4. **Consider alternatives** and their trade-offs
5. **Provide use cases** and examples

## 🏗️ Architecture Guidelines

### Component Structure

```typescript
// Component file structure
interface ComponentProps {
  // Props interface
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks
  // Event handlers
  // Render logic
  
  return (
    // JSX with proper accessibility
  );
}
```

### File Organization

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── forms/           # Form components
│   └── layout/          # Layout components
├── hooks/               # Custom hooks
├── lib/                 # Utilities and configurations
├── pages/               # Page components
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

### State Management

- Use React hooks for local state
- Use React Query for server state
- Use Context for global UI state
- Avoid prop drilling

### Performance Guidelines

- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize images and assets
- Monitor bundle size

## 🔒 Security Guidelines

- Validate all user inputs
- Sanitize data before rendering
- Use HTTPS for all API calls
- Follow OWASP security guidelines
- Report security issues privately

## 📚 Documentation

When adding new features:

1. Update README.md if needed
2. Add JSDoc comments to functions
3. Update API documentation
4. Add examples and usage guides

## 🎯 Review Process

All submissions go through code review:

1. **Automated checks** must pass (CI/CD)
2. **Manual review** by maintainers
3. **Testing** in staging environment
4. **Approval** from at least one maintainer

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: support@enact-legal.com for private matters

## 🏆 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- Annual contributor appreciation

Thank you for contributing to ENACT! 🙏