# Notely

A portfolio project that is a note-taking application built with Remix, React, and TypeScript.

## Deployed Site

Check out [Notely!](https://notely.fly.dev)

## 🚀 Features

- Modern, responsive UI built with React and Tailwind CSS and Shadcn
- Authentication system with OAuth2 support (Google and Facebook)
- Email integration using React Email and Resend
- Real-time toast notifications using Sonner
- Secure password handling with bcrypt
- Form handling with Conform and Zod validation
- Persistent data storage with Prisma with Postgres

## 🛠️ Tech Stack

- **Framework**: [Remix](https://remix.run/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI/Shadcn
- **Database ORM**: Prisma
- **Database**: Postgres SQL
- **Authentication**: OAuth & custom server-side authentication
- **Deployment**: Fly.io
- **Email Service**: Resend
- **Form Handling**: Conform + Zod

## 📦 Prerequisites

- Node.js >= 20.0.0
- npm or yarn
- Docker (for development)

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/matthew-millard/notely.git
cd notely
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in the required values.

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:

```bash
npm run dev
```

## 📝 Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run email` - Start the email preview server

## 🤝 Contributing

No contributions as this is a personal porfolio project. Feel free to fork it though 🙂
