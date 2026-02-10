# Learn with Jiji - Frontend

Beautiful, responsive frontend for the Learn with Jiji AI Learning Companion.

## 🎨 Features

- ✅ Modern, professional UI design
- ✅ Fully responsive (mobile + desktop)
- ✅ Real-time server status indicator
- ✅ Chat interface with message history
- ✅ Example questions for quick start
- ✅ Resource cards with download links
- ✅ Smooth animations and transitions
- ✅ Loading states and error handling
- ✅ No framework dependencies (Pure HTML/CSS/JS)

## 🚀 Quick Start

### Prerequisites
- Backend server must be running on `http://localhost:3000`

### Steps

1. **Make sure backend is running:**
   ```bash
   cd learn-with-jiji-backend
   npm run dev
   ```

2. **Open frontend:**
   - Simply double-click `index.html`
   - OR right-click → Open with → Browser
   - OR use Live Server in VS Code

3. **Start asking questions!**

## 📂 Files

```
jiji-frontend/
├── index.html      # Main HTML structure
├── styles.css      # All styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## 🎯 How It Works

### 1. Server Health Check
On page load, checks if backend is running:
```javascript
GET http://localhost:3000/api/v1/health
```

Shows status indicator:
- 🟢 Green = Server online
- 🔴 Red = Server offline

### 2. Sending Questions
When user sends a question:
```javascript
POST http://localhost:3000/api/v1/ask-jiji
Body: { "query": "Explain RAG" }
```

### 3. Displaying Response
- Shows AI-generated answer
- Displays learning resources (PPT, videos)
- Provides download links

## 🎨 Design Features

### Color Scheme
- Primary: Purple gradient (#667eea to #764ba2)
- Accent: Green (#10b981) for success states
- Clean white interface with subtle shadows

### Responsive Design
- Desktop: Full layout with side-by-side elements
- Mobile: Stacked layout, optimized for touch
- Breakpoint: 768px

### Animations
- Smooth fade-ins for messages
- Hover effects on buttons and cards
- Loading spinner during API calls
- Auto-scroll to latest message

## 🔧 Configuration

### Change Backend URL
Edit `script.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api/v1';
// Change to your backend URL
```

### Customize Colors
Edit `styles.css`:
```css
:root {
    --primary: #667eea;
    --secondary: #764ba2;
    /* Add your colors */
}
```

## 📱 Features Breakdown

### 1. Hero Section
- Attractive landing area
- Live statistics
- Clear value proposition

### 2. Chat Interface
- Message history
- User messages (right, purple)
- AI responses (left, gray)
- Resource cards

### 3. Example Questions
- Pre-defined queries
- Click to auto-fill
- Great for first-time users

### 4. About Section
- Explains features
- Benefits of using Jiji
- Professional presentation

## 🐛 Troubleshooting

### Problem: "Server offline" message
**Solution:** 
- Make sure backend is running: `npm run dev`
- Check backend is on port 3000
- Verify no CORS errors in browser console

### Problem: Can't send messages
**Solution:**
- Check browser console for errors
- Verify backend URL in script.js
- Ensure backend has CORS enabled

### Problem: Resources not loading
**Solution:**
- Check if files exist in Supabase Storage
- Verify signed URLs are working
- Check network tab in browser DevTools

## 🎥 Demo Video Tips

When recording demo:

1. **Show the landing page** (2 sec)
   - Clean, professional design

2. **Server status** (2 sec)
   - Green indicator = working

3. **Ask a question** (5 sec)
   - Type or click example
   - Show loading state

4. **Show response** (10 sec)
   - AI answer appears
   - Resources displayed
   - Click download link

5. **Ask another question** (5 sec)
   - Show chat history

Total: ~25 seconds for frontend demo

## 💡 Enhancement Ideas

Future improvements you could add:

1. **User Authentication**
   - Login/signup forms
   - Save chat history per user

2. **Dark Mode**
   - Toggle button
   - Different color scheme

3. **Voice Input**
   - Microphone button
   - Speech-to-text

4. **Export Chat**
   - Download conversation as PDF
   - Share via link

5. **Search History**
   - Search previous questions
   - Filter by date/topic

## 📊 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🎓 What This Demonstrates

### Technical Skills:
- Modern HTML5 structure
- CSS Grid & Flexbox
- Responsive design
- Vanilla JavaScript (ES6+)
- Async/await patterns
- DOM manipulation
- API integration
- Error handling

### Design Skills:
- User experience (UX)
- User interface (UI)
- Color theory
- Typography
- Spacing & layout
- Animations

### Professional Skills:
- Clean code
- Code organization
- Comments & documentation
- Cross-browser compatibility

## 🚀 Deployment

### Option 1: Netlify (Free)
1. Drag & drop these 3 files to Netlify
2. Update `API_BASE_URL` to your deployed backend
3. Done!

### Option 2: Vercel (Free)
```bash
npm install -g vercel
vercel
```

### Option 3: GitHub Pages
1. Push to GitHub
2. Settings → Pages
3. Select branch
4. Done!

**Note:** Update backend URL when deploying!

## 📞 Support

If you need help:
- Check browser console for errors
- Verify backend is running
- Test API endpoints directly

---

**Built with ❤️ for VeidaLabs Assignment**

This frontend showcases:
- Full-stack development skills
- Modern web design
- Professional UI/UX
- Real-world API integration
