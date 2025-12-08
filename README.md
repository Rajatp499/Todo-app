# TO-DO App

A minimal React + TypeScript to‑do app using Appwrite for authentication and realtime task storage. Features user auth, task CRUD, nested subtasks, and realtime sync.

## ✨ Features

- Email/password authentication (Appwrite sessions)
- Create, complete, delete tasks
- Nested subtasks with independent completion state
- Realtime updates per user using Appwrite Database
- Fully typed React + TypeScript codebase

## 🛠 Tech Stack

- Frontend: React 18, TypeScript, Vite
- Backend: Appwrite (Auth + Database)
- Styling: Tailwind CSS
- State: React hooks (useState, useEffect)
- State management: Redux toolkit

## 🚀 Quick Start

Prerequisites
- Node.js 18+
- Appwrite instance (self-hosted or cloud)

1. Clone & install
```bash
git clone https://github.com/Rajatp499/Todo-app.git
cd Todo-app
npm install
```

2. Appwrite setup
- Create a new Appwrite project.
- Create a Database (e.g. `Todo app`) and collections:

Collection: `todo`
- Fields:
    - `title` (string)
    - `groupId` (boolean)
    - `status` (boolean)
    - `userId` (string)

Collection: `task`
- Fields:
    - `title` (string)
    - `groupId` (string)
    - `status` (boolean)
    - `parentTaskId` (string)

Collection: `users` (optional)
- Fields:
    - `userId` (string)
    - `name` (string)
    - `email` (email)


- Create an API key or configure client to use project ID & endpoint.
- Ensure appropriate collection permissions (restrict reads/writes to document owner when needed).

3. Environment
Create a `.env` (Vite expects VITE_ prefix):
```

VITE_APPWRITE_ENDPOINT=https://cloud.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID =<project_id>
VITE_APPWRITE_DATABASE_ID =<dtatbase_id>
VITE_APPWRITE_USER_COLLECTION_ID =<user_collection_id>
VITE_APPWRITE_TODO_COLLECTION_ID =<todo_collection_id>
VITE_APPWRITE_TASK_COLLECTION_ID =<task_collection_id>
```

4. Run locally
```bash
npm run dev
```

Build for production
```bash
npm run build
npm run preview
```

## Usage notes

- Authentication flow uses Appwrite email/password sessions. After login, use the signed-in user's ID to scope task reads/writes.
- Subtasks are also stored on task collection with `groupId` and `parentTaskId` to identify their task Group and their parent Task.

## Development tips
- enable row security for todo collection and enable only create permission for all user
- Validate `subtasks` JSON shape in UI before sending to Appwrite to avoid schema issues.

## Contributing

- Fork, create a feature branch, open a PR with changes and a short description.
- Keep changes focused and include tests where applicable.


## Troubleshooting

- 401/403: check project ID, endpoint, and auth sessions.
- Realtime not working: ensure real-time feature is enabled and SDK client is initialized with correct endpoint.

If you want, I can generate example Appwrite client initialization and sample React hooks (useAuth/useTasks) next.
