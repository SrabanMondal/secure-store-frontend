# Secure Store - Frontend

This is the **Next.js + React + TypeScript** frontend for the Secure Store
project, a Google Drive-like file storage and sharing platform. It
provides a modern, intuitive UI for file management with **folder-based
navigation, encrypted uploads, presigned uploads, downloads, sharing,
trash management, and search functionality**.

## 🚀 Tech Stack

-   **Next.js 14**: App Router & server/client components
-   **TypeScript**: Full type safety
-   **Zustand**: Global state management (auth, files, current folder
    path)
-   **ShadCN UI**: Prebuilt, customizable React components
-   **Axios**: API client for backend integration
-   **Lucide React**: Icons
-   **TailwindCSS**: Styling
-   **Features**:
    -   Encrypted file upload (AES-GCM)
    -   Presigned S3/MinIO uploads
    -   File sharing via secure tokens
    -   Trash page with restore capability
    -   Folder-level search (non-recursive)

## 📂 Folder Structure

```
    src/
    ├─ app/
    │  ├─ (auth)/
    │  │  ├─ login/
    │  │  │  └─ page.tsx        # Login page
    │  │  └─ register/
    │  │     └─ page.tsx        # Register page
    │  ├─ dashboard/
    │  │  ├─ page.tsx           # Main dashboard page
    │  │  └─ layout.tsx         # Dashboard layout (sidebar + topnav)
    │  └─ shares/[token]/
    │     └─ page.tsx           # Share download page with optional password
    ├─ components/
    │  ├─ file-explorer.tsx     # Folder/file grid, download/delete/share actions
    │  ├─ upload-modal.tsx      # File upload modal (normal/encrypted)
    │  ├─ sidebar.tsx           # Dashboard sidebar
    │  ├─ topnav.tsx            # Dashboard top navigation
    │  └─ trash-page.tsx        # Deleted files with restore
    ├─ hooks/
    │  └─ use-protected-route.ts # Route protection
    ├─ lib/
    │  └─ api.ts                # Axios instance with token interceptor
    ├─ store/
    │  ├─ auth.ts               # Auth store (Zustand)
    │  ├─ files.ts              # File store + tree builder
    │  └─ explorer.ts           # Current folder path store
```

## 🎯 Features Implemented

### ✅ Authentication

-   Login & register using backend JWT auth
-   Zustand manages token & route protection
-   Protected dashboard routes

### ✅ Dashboard / File Manager

-   Google Drive-style folder + file explorer
-   Folder click opens folder and updates `currentPath` in Zustand
-   File cards with **download**, **delete**, **share**
-   Breadcrumb navigation with "Up" button
-   Upload modal uses **current folder path** by default
    -   Optional encrypted uploads
    -   Presigned upload flow
-   Files and folders displayed using **tree builder** (Zustand +
    memoized)

### ✅ Trash Page

-   Lists deleted files
-   Restore files before cleanup job removes them
-   Mirrors normal file explorer UI

### ✅ Sharing

-   Share button generates token
-   Frontend builds URL: `FRONTEND_URL/share/{token}`
-   Download flow:
    -   Direct download (octet-stream)
    -   Redirect to presigned MinIO URL
    -   Password-protected shares prompt modal

### ✅ Search

-   Folder-level search (non-recursive)
-   Filter files by name inside current folder

### ✅ Upload UX

-   Upload button always uses **current folder path** by default
-   Option to override folder path manually
-   Seamless integration with backend presigned or encrypted upload
    endpoints

## 🛠 Usage

### 1. Install dependencies

``` bash
yarn install
# or
npm install
```

### 2. Run dev server

``` bash
yarn dev
# or
npm run dev
```

### 3. Environment Variables

Create a `.env.local` file:

``` bash
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### 4. State Management

-   **AuthStore**: JWT token, login/logout state
-   **FileStore**: List of files, file tree, fetch/add/remove actions
-   **ExplorerStore**: Current folder path for file explorer

## 📌 Notes / Future Enhancements

-   Recursive folder search
-   File preview (PDF, images)
-   Drag & drop file/folder upload
-   Client-side file compression/virus scan before upload
-   Embedding / vector search for files
-   Batch operations (delete multiple, move multiple)
-   Real-time updates via WebSocket (e.g., file changes, share updates)

## 🖼 Screenshots

-   **Dashboard**: Folder + file explorer, upload modal, topnav, sidebar
-   **Trash Page**: Deleted files with restore
-   **Share Page**: Password prompt & download

This frontend, together with the backend, provides a production-ready,
modular, and highly extensible file storage platform that mimics Google
Drive's functionality while integrating advanced features like
encryption, presigned uploads, and sharing with password protection.
