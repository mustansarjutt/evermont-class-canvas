# Evermont - Class Canvas

A premium interactive coding, diagramming, and note-taking workspace built with Next.js and Tailwind CSS. Class Canvas is designed for educators, students, and developers who need a seamless, unified environment for writing code, sketching diagrams, and compiling notes.

## Features

- **📝 Code Workspace**: A powerful, in-browser code editor powered by Monaco Editor with syntax highlighting, auto-completion, and real-time JavaScript execution.
- **🎨 Canvas Workspace**: A dynamic drawing board with tools for freehand drawing, shapes, text, icons, and erasing. Includes an adaptive dark mode and the ability to export diagrams as PNGs.
- **📓 Notes View**: A built-in markdown-friendly notes section. Save code snippets directly to your notes with a single click.
- **🌓 Adaptive Themes**: Beautiful, fully responsive Dark and Light modes that seamlessly adjust the UI, code editor, and canvas ink.
- **🐳 Docker Ready**: Comes with a production-ready multi-stage Docker setup and `docker-compose.yml` for effortless deployment.

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Editor**: `@monaco-editor/react`
- **Icons**: `lucide-react`
- **Markdown**: `react-markdown`

## Getting Started

### Local Development (Node.js)

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Docker Deployment

To run the application using Docker Compose:

```bash
# Build and start the container in detached mode
docker compose up -d --build
```

The application will be available at `http://localhost:4001`.

To stop the container:

```bash
docker compose down
```
