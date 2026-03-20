---
description: 
---

Multi-Tenant Machine Management System 

Objective:

Build a Multi-Tenant Machine Management Web Application where multiple organizations (clients) can manage their machines. Each machine has authentication keys and operational modes controlled by different roles.

The goal of this assignment is to test:
System design thinking
Multi-tenant architecture
Authentication & authorization
API key management
Frontend state management
Ability to explain generated code

Tech Stack Requirements
Frontend
Next.js/React.js (App Router preferred)
Tailwind CSS

Backend / Database (Temporary for this task)
Firebase /Supabase
No custom backend API required yet.

System Overview
The system has 3 main actors:

1. Super Admin
System owner with full control.
Capabilities:
Create clients
Change machine mode
View all clients and machines

2. Client (Organization Admin)
Each client represents a company.
Capabilities:
Register/Login
Verify email
Generate API key
Manage their machines
Generate or rotate machine API keys
View machine status
Restrictions:
Cannot change machine mode.

3. Machine
Each machine belongs to a specific client.
Properties:
Machine Name
Machine ID
Machine API Key
Client API Key
Mode
Status
Last Active Time

Core Features
1. User Registration
Fields:
Name
Email
Password
Organization Name
Flow:
User registers
System sends verification link
Clicking link verifies account
After verification user can login
If email service is difficult:
Implement manual verification token page.

Example:
/verify?token=abcd1234
2. Login System
After login:
Redirect user to:
/dashboard
Store authentication via:
Firebase Auth/Supabase Auth

3. Multi-Tenant Structure
Each user belongs to a client organization.
Example structure:
Client
 ├── client_id
 ├── name
 ├── client_api_key
 ├── created_at
Machines belong to clients.

Machine
 ├── machine_id
 ├── machine_name
 ├── machine_api_key
 ├── client_id
 ├── mode
 ├── status

4. API Key System
Client API Key
Each client has one API key.
Features:
Client can:
Generate new key
Rotate existing key

Example:
client_api_key: cl_9d83hd8shd8
Machine API Key
Each machine has its own key.
Features:
Client can:
Generate machine key
Reset machine key
Example:
machine_api_key: mc_238jd83hd

5. Machine Modes

Each machine has a mode.
Modes:
Prepaid
Postpaid (Default)

Rule:
Role	Can change machine mode
Client	No
Super Admin	Yes

6. Client Dashboard

After login client should see:

Dashboard Cards
Total Machines
Active Machines
Inactive Machines

Machine List
Table view:
Machine Name	Mode	Status	Last Seen	Actions
Actions:
View details
Reset machine key
Disable machine
7. Machine Detail Page
Route:
/machines/[id]

Show:
Machine Name
Machine ID
Machine API Key
Client API Key
Mode
Status
Created date

8. Machine Key Management

Client should be able to:
Generate Machine Key
Button:
Generate Machine API Key
Rotate Machine Key

Button:
Reset Machine API Key

9. Super Admin Panel
Route:
/admin
Features:
Client Management
Admin can:
View all clients
View client machines

Machine Mode Control
Admin can change:
Prepaid -> Postpaid
Postpaid -> Prepaid
Clients must not see this control.
10. Security Requirements
Must implement:
Tenant Isolation
Client must only see:
machines WHERE client_id == current_client
Never allow:
machines of other clients
API Key Generation
Keys should be random.
Example format:
cl_xxxxxxxxx
mc_xxxxxxxxx
UI Requirements
Use Tailwind components.
Pages required:
/login
/register
/dashboard
/machines
/machines/[id]
/admin
/settings
Bonus Features (Optional)

1. Machine Heartbeat
Machine can send status update:
last_active

2. Machine Status
Status types:
Active
Offline
Error
3. API Usage Counter
Track:
machine_api_calls

4. Role-Based Access Control
Roles:
super_admin
Client_admin
Database Schema Example
Clients
id
name
email
client_api_key
created_at

Users
id
email
password
client_id
role
verified

Machines
id
machine_name
machine_api_key
client_id
mode
status
created_at
last_active
Deliverables

Must submit:

1. GitHub Repository
Must include:
README
Setup instructions


2. System Architecture Document
Explain:
Database schema
Authentication flow
Multi-tenant design
API key logic
