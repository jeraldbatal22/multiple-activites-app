# Multiple Activities App

A modern, full-stack [Next.js 16](https://nextjs.org/) demo featuring a secret message board, todo lists, markdown notes, Google Drive-style uploads, user authentication, and more. Data is powered by Supabase; UI is built with Radix UI, Tailwind CSS, React 19, and advanced form validation (React Hook Form + Zod).  
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

- [Next.js 16](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Supabase](https://supabase.com/) (auth, storage, real-time DB)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Radix UI Primitives](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for schema-based validation
- [Vitest](https://vitest.dev/) & [Testing Library](https://testing-library.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 📂 Project Structure

```
.
├── app/                  # Next.js app directory & routing
├── components/           # UI components (forms, lists, UI patterns)
│   ├── forms/                  # In-app form components (auth, CRUD, markdown, etc.)
│   ├── friends/                # Friend request UI
│   ├── pokemons/               # Pokémon CRUD UI
│   ├── google-drive/           # Drive upload/view UI
│   ├── mark-down/              # Markdown editor UI
│   └── todo/                   # Todo CRUD UI
├── lib/                  # Redux hooks, helpers, and other shared logic
├── utils/                # Supabase client setup, general helpers
├── types/                # TypeScript custom types and schema
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

## 🖥️ Development Tips

- Edit pages and route handlers under `app/`
- Most UI and form logic lives under `components/`
- Custom hooks, including real-time subscriptions, are in `components/hooks/`
- Types live in `types/`
- Environment variables required:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Custom font via [Geist](https://vercel.com/font) using `next/font`

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
