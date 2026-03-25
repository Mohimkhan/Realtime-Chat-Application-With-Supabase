# 🚀 Realtime Chat Application

A modern, high-performance realtime chat application built with **Next.js 14**, **Supabase**, and **Framer Motion**. This application features instant messaging, secure authentication, and a sleek, responsive UI.

---

## 🏗️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)

---

## ✨ Features

- **⚡ Realtime Messaging**: Instant message delivery using Supabase Realtime. Allows users to send text messages, images, and also voice messages (in the near future).
- **🔐 Secure Authentication**: Robust user authentication and session management.
- **💬 Chat Rooms**: Create, join, and manage public and private chat rooms.
- **🎨 Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **🎭 Smooth Animations**: Fluid transitions and interactive elements powered by Framer Motion.
- **🔔 Live Notifications**: Realtime alerts for new messages and room updates.
- **🌓 Dark Mode**: Seamless theme switching for a premium user experience.

---

## 📂 Folder Structure

```text
.
├── app/                # Next.js App Router (pages, layouts, actions)
│   ├── auth/           # Authentication routes (login, register)
│   ├── actions/        # Server actions for rooms and messages
│   └── rooms/          # Chat room specific pages
├── components/         # Reusable UI & Business components
│   ├── common/         # Shared components (Header, Buttons)
│   ├── modals/         # Interactive modal dialogs
│   └── ui/             # Shadcn/UI primitive components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and Supabase clients
│   ├── schemas/        # Zod validation schemas
│   ├── supabase/       # Supabase client/server configurations
│   └── utils/          # Helper functions
├── public/             # Static assets (images, icons)
├── supabase/           # Supabase migrations and configurations
└── types/              # TypeScript type definitions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 16.0.0)
- npm or pnpm
- Supabase Account

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Mohimkhan/Realtime-Chat-Application-With-Supabase.git
   cd realtime-chat-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the app in action!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.
