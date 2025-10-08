# Security Policy

## Supported Versions

We actively support the following versions of ENACT Legal Platform:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT create a public issue

Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.

### 2. Send a private report

Instead, please send an email to **security@enact-legal.com** with the following information:

- **Subject**: Security Vulnerability Report
- **Description**: A clear description of the vulnerability
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Impact**: Potential impact and severity
- **Affected versions**: Which versions are affected
- **Suggested fix**: If you have suggestions for fixing the issue

### 3. What to expect

- **Acknowledgment**: We will acknowledge receipt of your report within 24 hours
- **Initial assessment**: We will provide an initial assessment within 72 hours
- **Regular updates**: We will keep you informed of our progress
- **Resolution timeline**: We aim to resolve critical vulnerabilities within 7 days

### 4. Responsible disclosure

We follow responsible disclosure practices:

- We will work with you to understand and resolve the issue
- We will not take legal action against researchers who follow this policy
- We will credit you in our security advisory (unless you prefer to remain anonymous)
- We ask that you do not publicly disclose the vulnerability until we have had a chance to address it

## Security Measures

### Current Security Implementations

- **Environment Variable Validation**: All environment variables are validated at runtime
- **Content Security Policy**: CSP headers implemented to prevent XSS attacks
- **Input Sanitization**: All user inputs are sanitized before processing
- **Secure Headers**: Security headers implemented (X-Frame-Options, X-Content-Type-Options, etc.)
- **Rate Limiting**: API rate limiting implemented to prevent abuse
- **Secure Storage**: Sensitive data is encrypted in storage
- **Authentication**: Secure authentication flow with Supabase
- **HTTPS Only**: All communications use HTTPS in production

### Security Best Practices

We follow these security best practices:

- Regular dependency updates and vulnerability scanning
- Automated security testing in CI/CD pipeline
- Code review process for all changes
- Principle of least privilege for access controls
- Regular security audits and penetration testing

## Security Updates

Security updates will be released as patch versions and will be clearly marked in the changelog. We recommend:

- Subscribe to our security advisories
- Keep your installation up to date
- Monitor our releases for security patches
- Follow our security guidelines in deployment

## Bug Bounty Program

We are considering implementing a bug bounty program. If you're interested in participating, please contact us at security@enact-legal.com.

## Contact

For any security-related questions or concerns:

- **Email**: security@enact-legal.com
- **Response time**: Within 24 hours
- **Encryption**: PGP key available upon request

## Legal

This security policy is subject to our Terms of Service and Privacy Policy. By reporting vulnerabilities, you agree to our responsible disclosure guidelines.