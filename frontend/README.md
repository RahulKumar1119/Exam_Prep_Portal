# JAIIB-CAIIB Exam Prep Portal - Frontend

React.js frontend for the JAIIB-CAIIB Exam Prep Portal, hosted on AWS Amplify with CloudFront CDN.

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- AWS Account with Amplify access
- AWS CLI v2 configured

### Installation

```bash
# Install dependencies
npm ci

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure

```
frontend/
├── public/                 # Static files
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React Context providers
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── styles/           # Tailwind CSS styles
│   ├── App.tsx           # Main App component
│   └── index.tsx         # Entry point
├── .env.development      # Development environment variables
├── .env.staging          # Staging environment variables
├── .env.production       # Production environment variables
├── amplify.yml           # Amplify build configuration
├── deploy.sh             # Deployment script
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Environment Configuration

### Development

```bash
# .env.development
REACT_APP_API_ENDPOINT=http://localhost:3001
REACT_APP_ENVIRONMENT=development
REACT_APP_LOG_LEVEL=debug
```

**Start development server:**
```bash
npm start
```

### Staging

```bash
# .env.staging
REACT_APP_API_ENDPOINT=https://staging-api.jaiib-caiib.example.com
REACT_APP_ENVIRONMENT=staging
REACT_APP_LOG_LEVEL=info
```

**Deploy to staging:**
```bash
bash deploy.sh staging
```

### Production

```bash
# .env.production
REACT_APP_API_ENDPOINT=https://api.jaiib-caiib.example.com
REACT_APP_ENVIRONMENT=production
REACT_APP_LOG_LEVEL=warn
```

**Deploy to production:**
```bash
bash deploy.sh production
```

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

The page will reload when you make changes.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`

Runs ESLint to check code quality.

### `npm run format`

Formats code using Prettier.

### `npm run analyze`

Analyzes the bundle size using source-map-explorer.

### `npm run deploy:dev`

Deploys to development environment.

### `npm run deploy:staging`

Deploys to staging environment.

### `npm run deploy:prod`

Deploys to production environment.

## Deployment

### Automated Deployment

The frontend is automatically deployed when code is pushed to the connected GitHub branch:

- **Development:** Push to `develop` branch
- **Staging:** Push to `staging` branch
- **Production:** Push to `main` branch

### Manual Deployment

```bash
# Deploy to specific environment
bash deploy.sh staging

# Or use npm scripts
npm run deploy:staging
```

### Deployment Process

1. Install dependencies
2. Run tests
3. Build React application
4. Deploy to AWS Amplify
5. Run smoke tests
6. CloudFront cache invalidation

## Performance Optimization

### Code Splitting

- React Router lazy loading
- Dynamic imports for large components
- Separate vendor bundle

### Asset Optimization

- Image compression (WebP format)
- CSS minification
- JavaScript minification
- Source map generation (dev only)

### Caching Strategy

- Browser caching for static assets
- CloudFront edge caching (1 year for static assets)
- React Query for API response caching (5 min TTL)

### Performance Targets

- Page load time: <3 seconds (3G)
- First Contentful Paint: <1.5 seconds
- Largest Contentful Paint: <2.5 seconds
- Cumulative Layout Shift: <0.1

## Responsive Design

### Breakpoints

- **Mobile:** <768px
- **Tablet:** 768px - 1919px
- **Desktop:** ≥1920px

### Touch-Friendly UI

- Minimum button size: 44×44px
- Proper spacing for touch interactions
- Hamburger menu on mobile
- Collapsible sidebar on tablet

## Security

### HTTPS/TLS

- All traffic redirected to HTTPS
- TLS 1.2+ required
- HSTS header enabled

### Environment Variables

- API endpoints configured per environment
- Sensitive data not exposed in frontend
- API keys stored securely

### Content Security Policy

- Inline scripts disabled
- External scripts whitelisted
- XSS protection enabled

## Monitoring

### CloudWatch Metrics

- Page load time
- Error rates
- API response time
- Cache hit rate

### CloudFront Logs

- Access logs stored in S3
- Analyzed for performance and errors
- Retention: 90 days

### Error Tracking

- Sentry integration (optional)
- CloudWatch error logs
- User session tracking

## Troubleshooting

### Build Issues

**Issue:** `npm ERR! code ERESOLVE`

**Solution:**
```bash
npm cache clean --force
npm ci --legacy-peer-deps
```

**Issue:** Build timeout

**Solution:**
- Increase build timeout in Amplify console
- Optimize dependencies
- Use npm ci instead of npm install

### Deployment Issues

**Issue:** Amplify deployment fails

**Solution:**
```bash
# Check Amplify logs
aws amplify list-jobs --app-id $AMPLIFY_APP_ID --branch-name main
```

**Issue:** CloudFront returns 403 Forbidden

**Solution:**
- Verify S3 bucket permissions
- Check CloudFront origin configuration
- Verify IAM role permissions

### Performance Issues

**Issue:** Slow page load

**Solution:**
```bash
# Analyze bundle size
npm run analyze

# Check CloudFront cache hit rate
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name CacheHitRate
```

## Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
npm test -- --testPathPattern=integration
```

### E2E Tests

```bash
npm run test:e2e
```

## Code Quality

### Linting

```bash
npm run lint
```

### Code Formatting

```bash
npm run format
```

### Type Checking

```bash
npm run type-check
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

### Core

- **react:** UI library
- **react-dom:** React DOM rendering
- **react-router-dom:** Client-side routing
- **axios:** HTTP client

### UI/Styling

- **tailwindcss:** Utility-first CSS framework
- **chart.js:** Charting library
- **react-chartjs-2:** React wrapper for Chart.js

### State Management

- **zustand:** Lightweight state management
- **react-query:** Server state management

### Utilities

- **date-fns:** Date manipulation
- **lodash:** Utility functions

## Contributing

1. Create a feature branch
2. Make changes
3. Run tests and linting
4. Submit pull request
5. Wait for review and approval

## Deployment Checklist

- [ ] All tests passing
- [ ] Code linting passed
- [ ] Build successful
- [ ] Environment variables configured
- [ ] Smoke tests passed
- [ ] CloudFront cache invalidated
- [ ] Performance metrics acceptable
- [ ] Security headers verified

## Support

For issues or questions:

1. Check `DEPLOYMENT.md` for detailed deployment guide
2. Check `../infrastructure/FRONTEND_INFRASTRUCTURE.md` for architecture
3. Review CloudWatch logs
4. Check CloudFront logs in S3

## Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Infrastructure Setup](../infrastructure/FRONTEND_INFRASTRUCTURE.md)
- [Quick Start Guide](../FRONTEND_SETUP_QUICK_START.md)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)

## License

Proprietary - JAIIB-CAIIB Exam Prep Portal

## Contact

For support, contact the development team.
