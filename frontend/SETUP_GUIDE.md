# React Frontend Setup Guide

## Project Overview

This is the React 18 frontend for the JAIIB-CAIIB Exam Prep Portal, built with TypeScript, Tailwind CSS, and React Router.

## Technology Stack

- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **React Router v6**: Client-side routing
- **Tailwind CSS 3**: Utility-first CSS framework
- **Axios**: HTTP client with interceptors
- **React Query**: Server state management
- **React Context**: Client state management (Auth, Practice, Dashboard, Notifications)

## Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Layout.tsx       # Main layout wrapper
│   │   │   ├── Header.tsx       # Top navigation
│   │   │   ├── Sidebar.tsx      # Side navigation
│   │   │   └── Footer.tsx       # Footer
│   │   ├── ProtectedRoute.tsx   # Route protection wrapper
│   │   └── LoadingSpinner.tsx   # Loading indicator
│   ├── context/
│   │   ├── AuthContext.tsx      # Authentication state
│   │   ├── PracticeContext.tsx  # Practice session state
│   │   ├── DashboardContext.tsx # Dashboard data state
│   │   └── NotificationContext.tsx # Notifications state
│   ├── pages/
│   │   ├── LoginPage.tsx        # Login page
│   │   ├── RegisterPage.tsx     # Registration page
│   │   ├── PasswordResetPage.tsx # Password reset page
│   │   ├── DashboardPage.tsx    # Performance dashboard
│   │   ├── PracticePage.tsx     # Practice interface
│   │   └── NotFoundPage.tsx     # 404 page
│   ├── services/
│   │   └── api.ts              # Axios API client with interceptors
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── App.tsx                 # Main app component
│   ├── index.tsx               # React entry point
│   └── index.css               # Global styles
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── .env.example                # Environment variables template
```

## Installation

### Prerequisites

- Node.js 18+ 
- npm 9+

### Steps

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.development
   ```
   
   Edit `.env.development` and set the API URL:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```

3. **Start development server**:
   ```bash
   npm start
   ```
   
   The app will open at `http://localhost:3000`

## Available Scripts

### Development

```bash
# Start development server with hot reload
npm start

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Lint code
npm run lint

# Format code with Prettier
npm run format
```

### Production

```bash
# Build for production
npm run build

# Analyze bundle size
npm run analyze

# Deploy to development environment
npm run deploy:dev

# Deploy to staging environment
npm run deploy:staging

# Deploy to production environment
npm run deploy:prod
```

## Configuration

### Tailwind CSS

Tailwind is configured in `tailwind.config.js` with:
- Custom color palette (primary, success, warning, danger)
- Responsive breakpoints (xs, sm, md, lg, xl, 2xl, 3xl)
- Custom spacing and shadows
- Utility classes for common patterns

### TypeScript

TypeScript configuration in `tsconfig.json` includes:
- Path aliases for cleaner imports (@components, @pages, @services, etc.)
- Strict type checking enabled
- React JSX support

### API Client

The Axios API client in `src/services/api.ts` includes:
- Request interceptor: Automatically adds auth token to requests
- Response interceptor: Handles token refresh on 401 errors
- Error handling: Consistent error response format
- Base URL configuration from environment variables

## State Management

### React Context Providers

The app uses React Context for state management:

1. **AuthContext**: User authentication, login, logout, registration
2. **PracticeContext**: Current practice session, answers, results
3. **DashboardContext**: Performance metrics and analytics
4. **NotificationContext**: User notifications and alerts

All providers are wrapped in `App.tsx` and can be accessed via custom hooks:
```typescript
const { user, login, logout } = useAuth();
const { current_session, generatePracticeSet } = usePractice();
const { dashboard_data, fetchDashboardData } = useDashboard();
const { notifications, fetchNotifications } = useNotification();
```

## Responsive Design

The UI is fully responsive with breakpoints:
- **Mobile** (<768px): Hamburger menu, stacked layout
- **Tablet** (768-1919px): Collapsible sidebar
- **Desktop** (≥1920px): Full layout with sidebar

All components use Tailwind's responsive utilities (sm:, md:, lg:, etc.)

## Authentication Flow

1. User registers with email, password, name, and bank affiliation
2. Verification email is sent
3. User clicks verification link
4. User logs in with email and password
5. JWT token is stored in localStorage
6. Token is automatically added to all API requests
7. On token expiration, refresh token is used to get new token
8. If refresh fails, user is redirected to login

## Error Handling

- API errors are caught and displayed to users
- Network errors show connection error messages
- Validation errors are shown inline on forms
- Server errors are logged to CloudWatch
- Fallback messages for service unavailability

## Performance Optimization

- React Query for server state caching (5-min TTL)
- Code splitting with React Router
- Lazy loading of components
- CloudFront CDN for static assets
- Image optimization
- CSS minification with Tailwind

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance
- Touch-friendly buttons (44×44px minimum)

## Development Tips

### Adding a New Page

1. Create component in `src/pages/PageName.tsx`
2. Add route in `App.tsx`
3. Add navigation link in `Sidebar.tsx`

### Adding a New Context

1. Create context file in `src/context/ContextName.tsx`
2. Export provider and custom hook
3. Wrap provider in `App.tsx`
4. Use hook in components

### Adding a New Component

1. Create component in `src/components/ComponentName.tsx`
2. Use TypeScript for type safety
3. Use Tailwind classes for styling
4. Export as default

### API Integration

Use the `apiClient` from `src/services/api.ts`:
```typescript
import { apiClient } from '@services/api';

// GET request
const response = await apiClient.get<DataType>('/endpoint');

// POST request
const response = await apiClient.post<DataType>('/endpoint', data);

// PUT request
const response = await apiClient.put<DataType>('/endpoint', data);

// DELETE request
const response = await apiClient.delete<DataType>('/endpoint');
```

## Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Rebuild TypeScript
npm run build
```

### Tailwind styles not applying
- Ensure `src/index.css` is imported in `src/index.tsx`
- Check that file paths in `tailwind.config.js` are correct
- Rebuild with `npm start`

## Deployment

### AWS Amplify Deployment

1. Connect repository to AWS Amplify
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `build`
3. Set environment variables in Amplify console
4. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build production bundle
npm run build

# Deploy to S3 and CloudFront
npm run deploy:prod
```

## Contributing

- Follow TypeScript strict mode
- Use Tailwind CSS for styling
- Write components as functional components with hooks
- Add proper error handling
- Test responsive design on multiple devices

## Support

For issues or questions, refer to:
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com)
