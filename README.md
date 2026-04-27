<<<<<<< HEAD
# 🚀 TaskMaster - Premium Full-Stack Todo App

TaskMaster is a modern, full-stack task management application built with a stunning **Glassmorphism** dark UI. It features real-time database synchronization, robust state management, and a custom beautiful interface designed to provide a premium user experience.

![TaskMaster UI](https://raw.githubusercontent.com/vercel/next.js/canary/examples/image-component/public/mountains.jpg) *(You can add your own screenshot here!)*

## ✨ Features

- **🔐 Authentication:** Secure Login and Registration powered by Supabase Auth.
- **🗂️ Project Management:** Create custom projects with dynamic colors to classify and organize your tasks.
- **✅ General & Classification Tasks:** Keep quick tasks in your General Inbox or categorize them into specific Projects.
- **📅 Custom Deadlines:** A beautifully crafted, animated Date & Time picker for setting task deadlines.
- **🔍 Advanced Search:** Instantly search through your tasks with real-time filtering.
- **🚀 Upcoming & Today Views:** Easily track scheduled tasks and prioritize your workflow.
- **👤 User Profiles:** Edit your custom username or perform a complete account/data wipe directly from the UI.

## 🛠️ Technology Stack

- **Frontend Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 💻 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Jo9looo/Task-Master.git
cd task-master
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Supabase Environment
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Setup Supabase Database
Run the following SQL commands in your Supabase SQL Editor to create the required tables:

```sql
-- Create Projects Table
create table projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  color_accent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Tasks Table
create table tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  completed boolean default false,
  priority text default 'medium',
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS)
alter table projects enable row level security;
alter table tasks enable row level security;

-- Create Policies (Only users can see/modify their own data)
create policy "Users can manage their own projects" on projects for all using (auth.uid() = user_id);
create policy "Users can manage their own tasks" on tasks for all using (auth.uid() = user_id);
```

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🌐 Deployment (Vercel)

This application is optimized for Vercel deployment:
1. Import your GitHub repository to Vercel.
2. Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel's Environment Variables.
3. Click Deploy!
4. **Important:** Add your new Vercel domain to your Supabase Project's `Authentication -> URL Configuration -> Site URL` to ensure login works perfectly in production.

---
Built with ❤️ using Next.js & Supabase.
=======

>>>>>>> 44dc82963dc53ce4a25ece2242741e12c9f00f34
