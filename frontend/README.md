# EduNexus — Smart Campus Admissions Portal (Frontend)

Modern, aesthetic, pastel-themed student admission and administrative verification portal built for Final Year Project (FYP).

---

## 🚀 Tech Stack

- **Framework:** React 19 + Vite 8 (JavaScript, ES Modules)
- **Styling:** Tailwind CSS v4 (Pastel blue & slate aesthetic, mobile & desktop responsive)
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios (automatic JWT Bearer header interceptor & 401 token refresh)
- **Icons:** Lucide React

---

## ⚙️ Configuration & Backend Setup

- **Backend Base URL:** `http://127.0.0.1:8000`
- **Backend Directory:** `backend/backend/edunexus/`
- **To Start Django Backend:**
  ```bash
  cd backend/backend/edunexus
  python manage.py runserver
  ```

---

## 🛠️ Frontend Setup & Run

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (already executed):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the web application at:
   ```
   http://localhost:5173/
   ```

---

## 👤 Test Accounts & Role Authorization

### Default Test Account in Database:
- **Username:** `teststudent`
- **Email:** `student@gmail.com`
- **Password:** *Use your assigned password or register a new candidate account via `/register`*

### New Candidate Registration:
- Visit `http://localhost:5173/register`
- Enter any username, email, and password to immediately register via `POST /api/users/`.
- Log in via `POST /api/token/`.

### Admin / Staff Demonstration:
- Accounts with username `admin`, email containing `admin`, or Django `is_staff: true` automatically receive Admin permissions.
- You can also toggle between **Student View** and **Admin View** with a single click inside the **Profile page** (`/profile`).

---

## 🧭 Application Workflows

1. **Authentication Flow:**
   - Register at `/register` -> Login at `/login` -> JWT stored in `localStorage` -> Persistent user profile loaded via `/api/users/{id}/`.
2. **Application Docket Flow:**
   - Navigate to `/new-application` -> Enter Date of Birth & CNIC -> Submit to `POST /api/applications/` -> Inspect status badge on `/dashboard` or detailed view on `/applications/:id`.
3. **Document Attachment Flow:**
   - From application details, click "Upload Document" -> Select application & document type -> Input storage file path -> Submits to `POST /api/documents/`.
4. **Campus AI Chatbot Flow:**
   - Visit `/chatbot` -> Ask questions regarding deadlines or requirements -> Chatbot performs fast keyword matching against `GET /api/faqs/`.
5. **Staff Review & Adjudication Flow:**
   - Access `/admin` or `/admin/queue` -> Filter dockets by status (Pending, Manual Review, Complete) -> Open `/admin/applications/:id` -> Update application status (`PUT /api/applications/:id/`) and verify attached documents.
