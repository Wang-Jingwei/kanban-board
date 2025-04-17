# kanban-board

## Project setup
```
npm install
```

### Firebase Configuration
This project requires Firebase to work properly. Follow these steps:

1. Copy the `src/firebase.js.example` file to `src/firebase.js`
2. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
3. Create a Firestore database in your Firebase project
4. Go to Project Settings > Your Apps > Add app and select the Web platform
5. Register your app and copy the Firebase configuration object
6. Replace the placeholder values in `src/firebase.js` with your actual Firebase configuration

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

