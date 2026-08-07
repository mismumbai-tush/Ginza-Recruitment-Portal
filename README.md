# Ginza Industries Ltd. — Enterprise HR Recruitment ATS & MRF Suite

A high-performance, Tech-Noir styled HR Recruitment Portal & Candidate Tracking System built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Includes real-time 2-way **Google Sheets sync** for MRF requisitions and Candidates, shareable direct application links, and Kanban/Table pipeline views.

---

## 📁 Repository File Structure To Push To GitHub

When pushing this project to GitHub, push **all files in this folder** except `node_modules` and `dist` (handled automatically by `.gitignore`).

```text
hr-recruitment-portal/
├── public/                     # Public static assets & tech-noir background image
│   └── tech_noir_bg.jpg
├── src/                        # Source Code
│   ├── components/             # UI Components
│   │   ├── ATSKanbanBoard.tsx
│   │   ├── CandidateApplicationModal.tsx
│   │   ├── CandidateDetailModal.tsx
│   │   ├── GoogleSheetsModal.tsx
│   │   ├── Navbar.tsx
│   │   ├── PublicJobPortal.tsx
│   │   ├── RequisitionForm.tsx
│   │   └── RequisitionList.tsx
│   ├── services/               # Business Logic & Persistence
│   │   ├── db.ts               # Local DB & Storage Engine
│   │   └── googleSheets.ts     # Google Apps Script Webhook Engine
│   ├── types/
│   │   └── recruitment.ts      # TypeScript Interfaces
│   ├── App.tsx                 # Main App Routing & URL Link Parser
│   ├── index.css               # Design System & Glassmorphism Utilities
│   └── main.tsx                # React Entry point
├── .gitignore                  # Ignores node_modules & dist
├── index.html                  # HTML Shell
├── package.json                # Dependencies & Build Scripts
├── README.md                   # Setup & Deployment Documentation
├── tsconfig.json               # TypeScript Configuration
└── vite.config.ts              # Vite Config
```

---

## 🚀 Step-by-Step: How to Push to GitHub

Run these 4 simple Git commands inside this project directory:

```bash
# 1. Initialize Git (if not done already)
git init

# 2. Add all files to staging
git add .

# 3. Create initial commit
git commit -m "Initial commit - Ginza Industries HR ATS & Google Sheets Sync"

# 4. Link your GitHub repository and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## 🌐 How to Deploy Live For Free

### Option 1: Vercel (Recommended - Takes ~30 Seconds)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New Project** ➔ Select your GitHub repository.
3. Keep default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Your live site URL will be generated instantly!

### Option 2: Netlify
1. Go to [netlify.com](https://netlify.com) and log in.
2. Click **Import from Git** ➔ Select your repository.
3. Set **Build command**: `npm run build` and **Publish directory**: `dist`.
4. Click **Deploy Site**.

---

## ⚡ Features
- 🏢 **Official Ginza Industries Ltd. Branding** & Tech-Noir design system.
- 🔗 **Shareable Direct Job Links**: HR can copy direct role links for LinkedIn, WhatsApp, or Naukri.
- 📊 **Dual Pipeline View**: Toggle between **Kanban Board** & **Table Data View**.
- 📅 **Date Range Filters**: Filter applications by **This Week**, **This Month**, **This Year**, or **All Time**.
- 🟢 **2-Way Google Sheets Sync**: Auto-sync candidate scorecards and MRF requisitions directly to your Google Sheet.
