# AI Meeting Notes Summarizer - Frontend

A React.js frontend application for the AI-powered meeting notes summarizer.

## Features

- **Intuitive Interface**: Clean, modern UI for easy interaction
- **Real-time Editing**: Edit AI-generated summaries with live preview
- **Email Sharing**: Share summaries with multiple recipients
- **History Management**: View, search, and manage all summaries
- **Responsive Design**: Works on desktop and mobile devices
- **Toast Notifications**: User-friendly feedback for all actions
- **Sample Data**: Quick-start with pre-loaded example content

## Tech Stack

- **React 18** with functional components and hooks
- **React Router** for navigation
- **Axios** for API communication
- **React Toastify** for notifications
- **Heroicons** for icons
- **CSS3** with modern styling

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running on port 5000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the frontend directory (optional):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

If not specified, the app will use the proxy configuration to connect to `http://localhost:5000`.

## Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`
Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Project Structure

```
frontend/
├── public/
│   ├── index.html        # HTML template
│   └── manifest.json     # PWA manifest
├── src/
│   ├── components/       # Reusable components
│   │   ├── Header.js     # Navigation header
│   │   ├── LoadingSpinner.js  # Loading indicator
│   │   └── EmailInput.js # Email input with validation
│   ├── pages/           # Page components
│   │   ├── HomePage.js   # Summary creation page
│   │   ├── SummaryPage.js # Summary view/edit page
│   │   └── HistoryPage.js # Summary history page
│   ├── services/        # API service layer
│   │   └── apiService.js # Backend API integration
│   ├── App.js           # Main app component
│   ├── index.js         # React entry point
│   └── index.css        # Global styles
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Features Overview

### Home Page (`/`)
- **Text Input**: Paste meeting transcripts or notes
- **Custom Instructions**: Define how you want the AI to summarize
- **Quick Prompts**: Pre-defined prompt templates
- **Tags**: Organize summaries with custom tags
- **Sample Data**: Load example content to test the app

### Summary Page (`/summary/:id`)
- **View Summary**: Display AI-generated summary
- **Edit Mode**: Modify and save summary changes
- **Copy to Clipboard**: Quick copy functionality
- **Email Sharing**: Send summary to multiple recipients
- **Share History**: Track who received the summary
- **Original Context**: Collapsible view of original text and prompt

### History Page (`/history`)
- **Summary List**: All summaries with pagination
- **Statistics**: Overview of usage and sharing metrics
- **Quick Actions**: View, edit, or delete summaries
- **Filter/Search**: Find summaries by title or tags

## Components

### Header Component
- Navigation between pages
- Active page highlighting
- Consistent branding

### LoadingSpinner Component
- Reusable loading indicator
- Customizable size and text
- Used during API calls

### EmailInput Component
- Multi-email input with validation
- Tag-style email display
- Keyboard shortcuts (Enter, comma, semicolon)
- Paste support for multiple emails
- Remove functionality

## API Integration

The frontend communicates with the backend through the `apiService`:

```javascript
// Generate summary
const response = await apiService.generateSummary({
  originalText: "...",
  customPrompt: "...",
  title: "...",
  tags: [...]
});

// Share summary
await apiService.shareSummary(summaryId, emails);

// Get summaries
const summaries = await apiService.getAllSummaries(page, limit);
```

## Styling

The application uses custom CSS with:
- **CSS Grid & Flexbox** for layouts
- **CSS Variables** for consistent theming
- **Responsive Design** with mobile-first approach
- **Modern UI Patterns** with cards, buttons, and forms
- **Accessibility** considerations

### Key Style Features
- Gradient backgrounds and buttons
- Smooth animations and transitions
- Consistent spacing and typography
- Toast notifications for user feedback
- Loading states and disabled states

## Error Handling

- **Network Errors**: User-friendly messages for connection issues
- **Validation Errors**: Real-time form validation
- **API Errors**: Detailed error messages from backend
- **Loading States**: Clear indication of ongoing operations
- **Fallback UI**: Graceful degradation when features fail

## Responsive Design

The application is fully responsive:
- **Desktop**: Full feature set with multi-column layouts
- **Tablet**: Adapted layouts with touch-friendly controls
- **Mobile**: Single-column layout with optimized interactions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `App.js`
3. Update navigation in `Header.js`

### Adding New Components
1. Create component in `src/components/`
2. Export from component file
3. Import where needed

### API Integration
1. Add new methods to `apiService.js`
2. Handle loading and error states
3. Update UI based on response

## Performance Optimization

- **Code Splitting**: Automatic with Create React App
- **Image Optimization**: Lazy loading and modern formats
- **Bundle Size**: Regular analysis and optimization
- **API Calls**: Efficient data fetching with proper caching

## Deployment

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deployment Options
- **Netlify**: Connect Git repository for automatic deployments
- **Vercel**: Zero-config deployment with custom domains
- **GitHub Pages**: Free hosting for static sites
- **AWS S3**: Scalable static hosting
- **Docker**: Containerized deployment

### Environment Configuration
Set production environment variables:
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure backend is running on port 5000
   - Check CORS configuration
   - Verify API endpoints

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check for syntax errors
   - Update dependencies

3. **Styling Issues**
   - Check CSS specificity
   - Verify responsive breakpoints
   - Test across different browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Future Enhancements

- **Dark Mode**: Theme switching capability
- **Search/Filter**: Advanced summary filtering
- **Export Options**: PDF, Word document export
- **Templates**: Pre-defined summary templates
- **Collaboration**: Multi-user editing
- **Analytics**: Usage analytics dashboard

## License

MIT License
