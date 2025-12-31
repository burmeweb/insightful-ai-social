# web.io
Webapp
# Project Structure 
```
src/
├── components/
│   ├── threejs/           # 3D Components
│   │   ├── Avatar3D.jsx
│   │   ├── ChatRoom3D.jsx
│   │   └── VoiceWave.jsx
│   ├── chat/             # Chat Components
│   ├── group/            # Group Components
│   └── ui/               # UI Components
├── pages/
│   ├── PublicPage.jsx    # Public Feed
│   ├── ChatPage.jsx      # Individual Chat
│   ├── GroupPage.jsx     # Group Chat & Management
│   ├── FriendsPage.jsx   # Friend List
│   ├── ProfilePage.jsx   # Profile Editing
│   ├── SettingsPage.jsx  # Security Settings
│   ├── AdminPage.jsx     # Admin Dashboard
│   └── AboutPage.jsx     # About & Updates
├── firebase/
│   ├── config.js         # Firebase config
│   ├── auth.js           Auth functions
│   └── firestore.js      # DB operations
├── contexts/
│   ├── AuthContext.jsx   # Auth state
│   └── ChatContext.jsx   # Chat state
└── utils/
    ├── helpers.js        # Helper functions
    └── constants.js      # App constants
```
