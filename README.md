# web.io
Webapp
# Project Structure 
```insightful-ai-social/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   └── models/
├── src/
│   ├── components/
│   │   ├── threejs/
│   │   │   ├── Avatar3D.jsx
│   │   │   ├── VoiceRoom3D.jsx
│   │   │   ├── ChatBubble3D.jsx
│   │   │   └── LoadingScene.jsx
│   │   ├── chat/
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── ChatSidebar.jsx
│   │   │   └── ChatHeader.jsx
│   │   ├── group/
│   │   │   ├── GroupCard.jsx
│   │   │   ├── GroupAdminPanel.jsx
│   │   │   ├── VoiceChat.jsx
│   │   │   └── MemberList.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   └── Toast.jsx
│   │   └── layout/
│   │       ├── Navbar.jsx
│   │       ├── Sidebar.jsx
│   │       └── Footer.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── dashboard/
│   │   │   ├── Home.jsx
│   │   │   ├── PublicFeed.jsx
│   │   │   ├── Friends.jsx
│   │   │   └── Profile.jsx
│   │   ├── chat/
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── GroupChat.jsx
│   │   │   └── VoiceRoom.jsx
│   │   ├── settings/
│   │   │   ├── Account.jsx
│   │   │   ├── Privacy.jsx
│   │   │   └── Notifications.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Users.jsx
│   │       └── Analytics.jsx
│   ├── firebase/
│   │   ├── config.js
│   │   ├── auth.js
│   │   ├── firestore.js
│   │   └── storage.js
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   └── ThemeContext.jsx
│   ├── stores/
│   │   ├── authStore.js
│   │   ├── chatStore.js
│   │   └── uiStore.js
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── constants.js
│   │   └── validators.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
├── .gitignore
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```
# Bash
```
# Initialize git repository
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Insightful AI Social Platform"

# Add remote repository
git remote add origin https://github.com/burmeweb/insightful-ai-social.git

# Push to GitHub
git branch -M main
git push -u origin main
```
# Bash Firebase 
```
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Select:
# - Hosting
# - Use existing project
# - Public directory: dist
# - Single-page app: Yes
# - Don't overwrite index.html

# Build project
npm run build

# Deploy to Firebase
firebase deploy

# Deploy with specific project
firebase deploy --project insightful-ai-b3hca
```
# npm run
```
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Firebase
npm run deploy
```
