# 🤖 AI Meeting Notes Summarizer

A full-stack MERN application that transforms meeting transcripts into structured, actionable summaries using AI and enables easy sharing via email.

## ✨ Features

### Core Functionality
- **📄 Text Upload**: Paste meeting transcripts, call notes, or any text content
- **🎯 Custom Instructions**: Define specific summarization requirements (bullet points, action items, executive summaries, etc.)
- **🤖 AI Summarization**: Powered by Groq's advanced language models
- **✏️ Editable Summaries**: Modify AI-generated content to match your needs
- **📧 Email Sharing**: Send formatted summaries to multiple recipients
- **📚 History Management**: Track, organize, and manage all your summaries

### User Experience
- **⚡ Fast & Responsive**: Modern React interface with real-time updates
- **📱 Mobile Friendly**: Works seamlessly across all devices
- **🏷️ Tagging System**: Organize summaries with custom tags
- **📊 Analytics**: Track usage and sharing statistics
- **🔄 Auto-save**: Never lose your work with automatic saving

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Toastify** - User notifications
- **CSS3** - Modern styling with Grid & Flexbox

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Groq SDK** - AI summarization service
- **Nodemailer** - Email sending capabilities

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or cloud service)
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Email service credentials (Gmail, Outlook, etc.)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd note-summarizer-mangodesk-task
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

### 4. Configuration

Edit `backend/.env` with your settings:

```env
# Required
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=mongodb://localhost:27017/note-summarizer

# Optional (for email sharing)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🎯 How It Works

### 1. Create a Summary
1. **Enter Title**: Give your summary a descriptive name
2. **Paste Content**: Add your meeting transcript or notes
3. **Set Instructions**: Choose from templates or write custom instructions
4. **Add Tags**: Organize with relevant tags (optional)
5. **Generate**: Click "Generate Summary" and wait for AI processing

### 2. Review & Edit
1. **View Results**: See the AI-generated summary
2. **Make Edits**: Modify content to match your requirements
3. **Save Changes**: Updates are saved automatically

### 3. Share via Email
1. **Click Share**: Open the sharing dialog
2. **Add Recipients**: Enter email addresses (supports bulk paste)
3. **Send**: Recipients receive a beautifully formatted email

## 📖 API Documentation

### Summary Endpoints
- `POST /api/summarize` - Generate new summary
- `GET /api/summarize/:id` - Get specific summary
- `PUT /api/summarize/:id` - Update summary
- `GET /api/summarize` - List all summaries (paginated)
- `DELETE /api/summarize/:id` - Delete summary

### Sharing Endpoints
- `POST /api/share` - Share summary via email
- `GET /api/share/history/:id` - Get sharing history
- `GET /api/share/stats` - Get usage statistics

## 🎨 Screenshots

### Home Page - Create Summary
*Clean interface for inputting meeting notes and custom instructions*

### Summary View - Edit & Share
*View generated summaries with editing and sharing capabilities*

### History Page - Manage Summaries
*Organize and track all your AI-generated summaries*

## 🔧 Configuration Options

### Groq API Setup
1. Visit [Groq Console](https://console.groq.com)
2. Create account and generate API key
3. Add key to `.env` file
4. Supports multiple models (Mixtral, Llama, etc.)

### Email Configuration
Supports any SMTP provider:

**Gmail Setup:**
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in `EMAIL_PASS`

**Other Providers:**
- Outlook/Hotmail
- Yahoo Mail
- Custom SMTP servers
- SendGrid, Mailgun, etc.

## 🚀 Deployment

### Backend Deployment
- **Railway**: One-click deployment
- **Heroku**: Easy scaling options
- **DigitalOcean**: VPS deployment
- **AWS EC2**: Enterprise solutions

### Frontend Deployment
- **Netlify**: Automatic Git deployments
- **Vercel**: Zero-config deployment
- **GitHub Pages**: Free static hosting
- **AWS S3 + CloudFront**: Scalable solution

### Docker Support
```bash
# Backend
docker build -t summarizer-backend ./backend
docker run -p 5000:5000 summarizer-backend

# Frontend
docker build -t summarizer-frontend ./frontend
docker run -p 3000:3000 summarizer-frontend
```

## 📊 Example Usage

### Sample Meeting Transcript
```
Team Standup - March 15, 2024
Attendees: John (PM), Sarah (Dev), Mike (Backend)

Updates:
- John: Product roadmap completed, client demo Friday
- Sarah: Authentication system design finished
- Mike: API endpoints 80% complete

Blockers:
- Mike: Waiting for database schema approval
- Sarah: Need UX designs for mobile layout

Action Items:
- John will prioritize new features by EOW
- Sarah will review API docs by Tuesday
- Mike will finish endpoints by Wednesday
```

### Custom Instructions Examples
- "Summarize in bullet points for executives"
- "Extract only action items and deadlines"
- "Create detailed technical summary"
- "Focus on decisions made and next steps"

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Test across different browsers

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB connection
- Verify environment variables
- Ensure port 5000 is available

**AI summarization fails:**
- Verify Groq API key
- Check API quotas/limits
- Test with shorter text

**Email sharing not working:**
- Verify SMTP credentials
- Check email provider settings
- Test with simple email clients

**Frontend connection errors:**
- Ensure backend is running
- Check CORS configuration
- Verify API endpoints

### Getting Help
- Check the README files in `backend/` and `frontend/` directories
- Review error messages in browser console
- Test API endpoints with curl or Postman
- Check logs in terminal/console

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** for powerful AI language models
- **React Team** for the amazing frontend framework
- **MongoDB** for flexible data storage
- **Open Source Community** for inspiration and tools

## 🔮 Future Roadmap

- **🌙 Dark Mode**: Theme switching capability
- **🔍 Advanced Search**: Filter summaries by content
- **📊 Analytics Dashboard**: Detailed usage insights
- **👥 Team Collaboration**: Multi-user workspaces
- **📱 Mobile App**: Native iOS/Android apps
- **🤖 More AI Models**: Support for additional providers
- **📄 Export Options**: PDF, Word, and other formats
- **🔗 Integrations**: Slack, Teams, Calendar apps

---

**Built with ❤️ using the MERN stack and powered by AI**
