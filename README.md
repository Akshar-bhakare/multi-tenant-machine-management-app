# Machine Manager (Multi-Tenant)

- High-end machine management platform.
- Next.js (App Router), Tailwind CSS (v4), Supabase.
<img width="1902" height="978" alt="image" src="https://github.com/user-attachments/assets/2cfec8f6-b7f2-47ba-9794-80e6a5511708" />

---

### 🚀 Setup Instructions

- Create a Supabase account and a new project.
- In **Settings -> API**, copy your **Project URL** and **Anon Key**.
- Create a `.env.local` file in the root.
- Add these two lines to the file:
    - `NEXT_PUBLIC_SUPABASE_URL=your_url_here`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here`
- Install dependencies: `npm install`
- Start the app: `npm run dev`
- Open `http://localhost:3000`

---

### 🗄️ Database Setup (Supabase)

- Go to **SQL Editor** in Supabase.
- Run `supabase/schema.sql` first.
- Run `supabase/rls-policies.sql` next.
- Wait! Check [ARCHITECTURE.md](./ARCHITECTURE.md) for full logic.

---

### 🔒 Test Accounts

**Super Admin (View/Manage All):**
- **Login**: `superadmin@test.com`
- **Pass**: `pass123`

**Client Admin (View/Manage Own):**
- **Login**: `test04@gmail.com`
- **Pass**: `pass123`

---

### 📧 Email Verification

- Implemented in code but currently **Disabled**.
- Users can login without clicking a verify link for this demo.

---

### 🏗️ Technical Docs

- [System Architecture](./ARCHITECTURE.md) - Learn how the multi-tenant system works.
