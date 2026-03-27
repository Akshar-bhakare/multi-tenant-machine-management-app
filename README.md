# Multi-Tenant Machine Management System

A multi-tenant web application for managing machines, built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Features

- **Role-Based Access Control**
  - **Super Admin**: Can view all clients, manage all machines, and uniquely change machine modes (Prepaid/Postpaid).
  - **Client Admin**: Can only view and manage machines belonging to their own organization.
- **Tenant Isolation**: Strictly enforced at the database level using Supabase Row Level Security (RLS) policies. Clients can never access data belonging to other tenants.
- **Authentication**: Fully integrated with Supabase Auth (Sign up, Login, Email Verification).
- **API Key Management**: Secure generation of Client API Keys and Machine API Keys.
- **Modern UI**: Built with shadcn/ui and Tailwind CSS v4 for a clean, responsive design.

---

## 🚀 Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project.
2. In your Supabase Dashboard, go to **Project Settings -> API** to find your Project URL and anon/public key.

### 2. Configure Environment Variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database, Auth, and Policies

We need to create the tables and security policies. Open the **SQL Editor** in your Supabase Dashboard and run the files in the `supabase/` directory in this specific order:

1. **`supabase/schema.sql`**: Creates the `clients`, `users`, and `machines` tables.
2. **`supabase/rls-policies.sql`**: Enables Row Level Security and creates access policies to ensure tenant isolation and role restrictions.

### 4. Create the Super Admin

A Super Admin is required to manage clients and change machine modes. Because Supabase Auth handles passwords securely, you must create the user account through the Auth interface first:

1. In Supabase Dashboard, go to **Authentication -> Users**.
2. Click **Add user -> Create new user**.
3. Enter an email (e.g., `admin@example.com`) and a password. Make sure to **Auto Confirm User** or manually verify the email.
4. Copy the unique **User UID** generated for this new user.

### 5. Run the Seed Script

1. Open `supabase/seed.sql` in your editor.
2. Replace the placeholder `'YOUR_SUPER_ADMIN_AUTH_UUID'` near the top of the file with the UID you copied in Step 4.
3. Keep the email the same as the one you used to register.
4. Go back to the **SQL Editor** in Supabase and run `supabase/seed.sql`. This will make your user a `super_admin` in the database and create a sample client and machine for testing.

---

## 💻 Running the App Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Log in using your Super Admin credentials, or register a new Client Admin to test the client isolation features.

---

## 🏗️ Architecture Notes

- **Frontend-Only Architecture**: The Next.js application communicates directly with Supabase from both Client Components (via `@supabase/ssr` `createBrowserClient`) and Server Components/Middleware (via `createServerClient`). There is no custom separate backend.
- **Data Fetching**: The application heavily relies on dynamic rendering (`force-dynamic`). Next.js fetches fresh data from the database on every request to ensure the dashboard and machine statuses are always up to date.
- **Security Check at Middleware**: Route protection (`src/middleware.ts`) verifies the user's session token on every request to protected routes (`/dashboard`, `/machines`, `/settings`, `/admin`). If there is no active session, the user is redirected to `/login`.
- **Role Guard Component**: The `<RoleGuard />` wrapper ensures that elements and pages are only accessible to permitted roles (e.g., preventing a `client_admin` from viewing the `/admin` route).
