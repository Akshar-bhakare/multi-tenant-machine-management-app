# System Architecture

- High-level design for the Multi-Tenant Machine Manager.

---

### 🗄️ Database Schema (Supabase)

- **Clients Table**: Stores organization names and unique API keys.
- **Users Table**: Linked to Supabase Auth. Stores roles (`super_admin` or `client_admin`) and `client_id` for association.
- **Machines Table**: Primary data. Stores machine names, statuses, and modes (Prepaid/Postpaid).
- **Relationships**: Machines are linked to Clients by `client_id`. Users are linked to Clients by `client_id`.

---

### 🔐 Authentication Flow

- **Login**: Handled by Supabase Auth (Email/Pass).
- **Session**: Middleware refreshes the token on every request to keep users logged in.
- **Roles**: Custom `UserProfile` table defines what a user can see (Super Admin vs. Client Admin).
- **Verification**: Email verify logic is in the code but skipped for this demo.

---

### 🏢 Multi-Tenant Design

- **Data Isolation**: USES **Row Level Security (RLS)** in Supabase.
- **Security Rules**: A Client Admin can ONLY see data where `client_id` matches their own Profile.
- **Super Admin**: Has special RLS bypass to see all clients and all machines.
- **Frontend**: One codebase, but the sidebar and dashboard content dynamic based on the tenant.

---

### 🔑 API Key Logic

- **Generation**: Created using secure random strings when a client or machine is added.
- **Rotation**: Admins can "Reset Key" to generate a new one instantly.
- **Display**: Keys are masked in the UI for security (e.g., `sk_live...`).
- **Standard**: Follows common SaaS patterns (e.g., Stripe-style keys).

---

### 🛠 Tech Stack Summary

- **Framework**: Next.js 15 (App Router).
- **Styling**: Tailwind CSS v4 + shadcn/ui.
- **Database**: PostgreSQL (Supabase).
- **Language**: TypeScript (Beginner Friendly).
