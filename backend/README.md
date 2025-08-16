# AI Meeting Notes Summarizer - Backend

A Node.js/Express backend API for the AI-powered meeting notes summarizer application.

## Features

- **AI Summarization**: Uses Groq API for intelligent text summarization
- **Email Sharing**: Send summaries via email with beautiful HTML formatting
- **MongoDB Storage**: Persistent storage for summaries and sharing history
- **RESTful API**: Clean API endpoints for frontend integration
- **Validation**: Input validation and error handling
- **CORS Support**: Configured for frontend integration

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Groq SDK** for AI summarization
- **Nodemailer** for email sending
- **Express Validator** for input validation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Groq API key
- Email service credentials (Gmail, Outlook, etc.)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment configuration:
```bash
cp .env.example .env
```

3. Configure your `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/note-summarizer
GROQ_API_KEY=your_groq_api_key_here

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key for AI summarization | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `EMAIL_HOST` | SMTP server hostname | For email sharing |
| `EMAIL_PORT` | SMTP server port | For email sharing |
| `EMAIL_USER` | Email account username | For email sharing |
| `EMAIL_PASS` | Email account password/app password | For email sharing |
| `FRONTEND_URL` | Frontend URL for CORS | No (defaults to localhost:3000) |
| `PORT` | Server port | No (defaults to 5000) |

## Getting API Keys

### Groq API Key
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

### Email Configuration (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Google Account → Security → App passwords
   - Select app: Mail
   - Copy the generated password to `EMAIL_PASS`

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 5000).

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Summaries
- `POST /api/summarize` - Generate a new summary
- `GET /api/summarize/:id` - Get a specific summary
- `PUT /api/summarize/:id` - Update a summary
- `GET /api/summarize` - Get all summaries (paginated)
- `DELETE /api/summarize/:id` - Delete a summary
- `POST /api/summarize/test-ai` - Test AI service connection

### Sharing
- `POST /api/share` - Share a summary via email
- `GET /api/share/history/:summaryId` - Get sharing history
- `GET /api/share/stats` - Get sharing statistics
- `POST /api/share/test-email` - Test email service

## Data Models

### Summary
```javascript
{
  originalText: String,      // Original meeting transcript
  customPrompt: String,      // User's summarization instructions
  generatedSummary: String,  // AI-generated summary
  editedSummary: String,     // User-edited version (optional)
  title: String,             // Summary title
  tags: [String],            // Organizational tags
  isShared: Boolean,         // Whether summary has been shared
  sharedWith: [{             // Sharing history
    email: String,
    sharedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Not found errors (404)
- Server errors (500)
- Service unavailable errors (503)

## Development

### Project Structure
```
backend/
├── models/           # MongoDB schemas
├── routes/           # API route handlers
├── services/         # Business logic services
├── server.js         # Express app setup
├── package.json      # Dependencies and scripts
└── .env.example      # Environment template
```

### Adding New Features
1. Create new route files in `routes/`
2. Add business logic to `services/`
3. Update models in `models/` if needed
4. Register routes in `server.js`

## Testing

Test the API endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Test AI service
curl -X POST http://localhost:5000/api/summarize/test-ai

# Test email service
curl -X POST http://localhost:5000/api/share/test-email \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "your-email@example.com"}'
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Groq API Errors**
   - Verify API key is correct
   - Check Groq service status
   - Ensure sufficient API credits

3. **Email Sending Fails**
   - Verify SMTP settings
   - Check email credentials
   - Enable "Less secure app access" or use app passwords

4. **CORS Issues**
   - Verify `FRONTEND_URL` in `.env`
   - Check frontend is running on correct port

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a process manager like PM2
3. Set up proper MongoDB cluster
4. Configure reverse proxy (nginx)
5. Enable HTTPS
6. Set up monitoring and logging

## License

MIT License
