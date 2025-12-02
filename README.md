# Multiple Activities App

A modern, full-stack [Next.js 16](https://nextjs.org/) application featuring multiple activity modules: todo management with real-time updates, Google Drive-style file uploads, food reviews, Pokémon reviews, and markdown notes. Built with Supabase for backend services, Redux Toolkit for state management, and a beautiful UI powered by Radix UI, Tailwind CSS v4, and React 19. Includes comprehensive form validation with React Hook Form + Zod, support, and full test coverage.

Project bootstrapped with `create-next-app`.

---

## 🚀 Getting Started

**Install dependencies:**
```bash
pnpm install
```

**Run the development server:**
```bash
pnpm run dev
```
Access the app at [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tech Stack

- [Next.js 16](https://nextjs.org/) - App Router with Server Components
- [React 19](https://react.dev/) - Latest React features
- [Supabase](https://supabase.com/) - Authentication, storage, and real-time database
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Radix UI Primitives](https://www.radix-ui.com/docs/primitives/overview/introduction) - Accessible UI components
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Schema-based form validation
- [Vitest](https://vitest.dev/) & [Testing Library](https://testing-library.com/) - Unit and integration testing
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering

---

## 📂 Project Structure

```
.
├── app/                          # Next.js app directory & routing
│   ├── (authenticated)/          # Protected routes (require auth)
│   │   ├── todo/                 # Todo management page
│   │   ├── google-drive/         # File upload/view page
│   │   ├── food-review/          # Food review CRUD page
│   │   ├── pokemon-review/       # Pokémon review CRUD page
│   │   ├── mark-down-notes/      # Markdown notes page
│   │   └── layout.tsx            # Authenticated layout wrapper
│   ├── api/                      # API routes
│   │   └── delete-account/       # Account deletion endpoint
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (auth form)
├── components/                   # UI components
│   ├── common/                   # Shared components (card-list, filtering, action-button)
│   ├── forms/                    # Authentication form
│   ├── todo/                     # Todo form and list components
│   ├── google-drive/             # File upload and list components
│   ├── food-review/              # Food review form and list components
│   ├── pokemons/                 # Pokémon form and list components
│   ├── mark-down/                # Markdown editor and list components
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-account-actions.ts        # Account management (sign out, delete)
│   │   ├── use-realtime-subscription.ts  # Generic real-time subscription hook
│   │   └── use-realtime-get-todos.ts     # Todo-specific real-time hook
│   ├── layout/                   # Layout components (header, navigation)
│   └── ui/                       # Reusable UI primitives (button, card, dialog, etc.)
├── lib/                          # Shared utilities and Redux setup
│   ├── providers/                # Redux provider
│   ├── slices/                   # Redux slices (auth, todo, food-review, etc.)
│   ├── hooks.ts                  # Redux typed hooks
│   └── store.ts                  # Redux store configuration
├── utils/                        # Utility functions
│   └── supabase/                 # Supabase client setup (client, server, middleware)
├── types/                        # TypeScript type definitions
└── ...
```

---

## 🧪 Running Tests

Run all tests:  
```bash
pnpm run test
```

Generate test coverage:  
```bash
pnpm run test:coverage
```

Run UI/tests in watch mode:  
```bash
pnpm run test:ui
```

---

## ✨ Features

- **User Authentication** - Sign up, sign in, and sign out with Supabase Auth
- **Todo Management** - Create, read, update, and delete todos with real-time synchronization
- **Google Drive-style Uploads** - Upload and manage files with Supabase Storage
- **Food Reviews** - Create and manage food reviews with ratings and descriptions
- **Pokémon Reviews** - Build a collection of Pokémon reviews
- **Markdown Notes** - Rich markdown editor for creating and editing notes
- **Real-time Updates** - Live data synchronization using Supabase real-time subscriptions
- **Account Management** - Delete account functionality with proper cleanup
- **Responsive Design** - Mobile-first, fully responsive UI
- **Form Validation** - Comprehensive client-side validation with Zod schemas
- **Toast Notifications** - User feedback via Sonner toast notifications

## 🖥️ Development Tips

- Edit pages and route handlers under `app/`
- Most UI and form logic lives under `components/`
- Custom hooks, including real-time subscriptions, are in `components/hooks/`
- Redux slices for state management are in `lib/slices/`
- Types live in `types/`
- Environment variables required:
  - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
  - `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` - Service role key (for account deletion API)
- Custom fonts via [Geist](https://vercel.com/font) using `next/font`
- Real-time subscriptions automatically handle connection lifecycle and cleanup

---

## 📚 Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Redux Toolkit Guides](https://redux-toolkit.js.org/introduction/getting-started)
- [Radix UI Docs](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vitest Docs](https://vitest.dev/guide/)

---

## 🚀 Deploy

Deploy instantly with Vercel:  
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

Or consult [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for advanced options.

---
## Test covered and total passed
<img width="1698" height="1255" alt="image" src="https://github.com/user-attachments/assets/7410daa7-329e-4c78-8dfa-f018d3504cf7" />
