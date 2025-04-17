# Kanban Board - Vue 3 + Firebase

A Kanban board application built with Vue 3, Vuex, Tailwind CSS, and Firebase. This app allows users to create multiple boards, manage columns and tasks with a clean, intuitive interface.

**Live Demo**: [https://kanban-board-607b5.web.app](https://kanban-board-607b5.web.app)


## Features

- **Board Management** – Create, switch, rename, and delete multiple Kanban boards
- **Column Operations** – Add, edit, and remove columns 
- **Card Management** – Create, edit, and delete task cards within each column
- **Real-time Sync** – Data changes are synchronized instantly 
- **Responsive Design** – Styling with Tailwind CSS utility classes
- **Persistent Data** – All boards, columns, and cards are stored in Firebase Firestore


## Tech Stack

- **Frontend**: Vue 3 with Composition API
- **State Management**: Vuex 4
- **Styling**: Tailwind CSS
- **Backend & Database**: Firebase (Firestore)
- **Hosting**: Firebase Hosting

## Project Setup

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd kanban-board
npm install
```

2. Configure Firebase:

   - Copy the `src/firebase.js.example` file to `src/firebase.js`
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Create a Firestore database in your Firebase project
   - Go to Project Settings > Your Apps > Add app and select the Web platform
   - Register your app and copy the Firebase configuration object
   - Replace the placeholder values in `src/firebase.js` with your actual Firebase configuration

3. Run the development server:

```bash
npm run serve
```


## Application Structure

```bash
src/
├── assets/              # Static assets
├── components/
│   ├── board/           # BoardView, Sidebar, KanbanBoard
│   ├── column/          # Column & card UI logic
│   ├── layout/          # Header, wrappers
│   └── common/          
├── services/            # Firebase service layer
├── store/               # Vuex store modules
└── firebase.js          # Firebase config

```
## Usage

1. Create a new board from the sidebar
2. Add columns to represent your workflow stages (e.g., "To Do", "In Progress", "Done")
3. Add cards to columns to represent tasks
4. Edit or delete cards and columns as needed

## Building for Production

To compile and minify the application for production:

```bash
npm run build
```

This will generate a `dist` directory with production-ready files.

