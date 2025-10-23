# 💝 CardForLove - Valentine Card Creator

A beautiful web application for creating and sharing Valentine's Day cards with your loved one.

## 🌟 Features

- **Create Valentine Cards**: Upload photos, add love messages, and set your relationship start date
- **YouTube Integration**: Add romantic songs to your card
- **Real-time Preview**: See your card as you create it
- **Share Cards**: Generate shareable links for your Valentine cards
- **Download Cards**: Export your cards as high-quality images
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for state management
- **html2canvas** for image export
- **date-fns** for date handling

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Multer** for file uploads
- **Sharp** for image processing
- **JWT** for authentication
- **CORS** for cross-origin requests

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:longbachit-lgtm/cardforlove.git
   cd cardforlove
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd valentine-story-web
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../bken
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd bken
   npm start
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd valentine-story-web
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
cardforlove/
├── valentine-story-web/          # Frontend React application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── hooks/               # Custom React hooks
│   │   └── lib/                 # Utility functions
│   └── public/                  # Static assets
├── bken/                        # Backend Node.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── controllers/     # Route controllers
│   │   │   ├── models/          # Database models
│   │   │   └── sub/             # Helper functions
│   │   ├── routes/              # API routes
│   │   └── config/              # Configuration files
│   └── uploads/                 # Uploaded files
└── README.md
```

## 🎯 API Endpoints

### Cards
- `POST /card` - Create a new Valentine card
- `GET /card/:id` - Get a specific card by ID
- `GET /card` - Get all cards (with pagination)
- `PUT /card/:id` - Update a card
- `DELETE /card/:id` - Delete a card

### Uploads
- `POST /upload` - Upload an image file

## 🎨 Features in Detail

### Card Creation
- Upload photos of both people
- Enter names for both people
- Set the relationship start date
- Add a YouTube video link
- Write a personalized love message
- Choose message color themes

### Card Display
- Beautiful card preview with photos and messages
- Days counter showing how long you've been together
- Embedded YouTube video player
- Share functionality with native Web Share API
- Download card as PNG image

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Optimized for all screen sizes

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cardforlove
JWT_SECRET=your_jwt_secret_here
```

### MongoDB Setup
1. Install MongoDB
2. Create a database named `cardforlove`
3. The application will automatically create collections

## 📱 Usage

1. **Create a Card**
   - Enter names of both people
   - Upload photos
   - Set relationship start date
   - Add YouTube video (optional)
   - Write love message
   - Click "Lưu thiệp"

2. **View and Share**
   - Card will be automatically displayed
   - Use share button to send to your loved one
   - Download as image if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all the open-source libraries that made this project possible
- Special thanks to the React and Node.js communities

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with 💝 for lovers everywhere
