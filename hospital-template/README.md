# 🏥 Hospital & Clinic Website Template — "Aurelia Medical Center"

> **Premium, ready-to-sell website template for private hospitals & clinics.**
> English-first (sells internationally), full Arabic RTL support, appointment booking system,
> admin panel — and **rebrand it for each client by editing just 2 files.**

**Live demo:** run `npm run dev` → http://localhost:5174

---

## ✨ What's Inside

| Feature | Details |
|---|---|
| 🌐 Languages | English (default) + Arabic (full RTL) — switcher in top bar |
| 🎨 Rebranding | Change name, logo, colors, photos, contact info in **1 config file** |
| 📅 Appointment Booking | 4-step wizard: department → doctor & date & time slots → patient details → printable confirmation |
| 👨‍⚕️ Doctors | 8 specialists, profiles, schedules, department filters |
| 🏢 Departments | 8 centers of excellence with detail popups |
| 🖼️ Gallery | Photo grid + lightbox — **client photos drop-in** |
| 📊 Admin Panel | Appointments management, status workflow, contact messages, stats dashboard |
| 📱 Design | Fully responsive, animated counters, testimonials slider, FAQ accordion, BMI calculator, insurance marquee, 24/7 emergency button |
| 💾 Persistence | Appointments & messages saved in browser (localStorage) — no backend needed |

---

## 🎯 Rebrand for a New Client (5 minutes)

### 1. `src/config/site.config.ts` — the ONLY file you must edit

```ts
brand: {
  logoText: 'A',                    // logo monogram letter
  name: 'Aurelia Medical Center',   // client's name
  fullName: 'Aurelia International Hospital & Clinics',
  tagline: { en: '...', ar: '...' },
},
theme: {
  primary: '#0E6B5C',      // main color  (e.g. '#1E5FA8' for blue)
  primaryDeep: '#0A2B26',  // dark sections color
  accent: '#C9A227',       // gold / highlight color
  cream: '#F6F3EC',        // light background tint
},
contact: {
  phone: '+1 (800) 555-0142',
  emergency: '+1 (800) 555-0199',
  whatsapp: '+18005550142',
  email: 'care@aureliamedical.com',
  address: { en: '...', ar: '...' },
  mapQuery: 'Boston MA',   // Google Maps search query
},
photos: {
  hero: '...',       // ← paste the CLIENT'S photo URLs or local files
  about: '...',
  appointment: '...',
  gallery: [ ... ],  // ← the client's facility photos
},
```

**Colors update the entire site instantly** (CSS variables are injected at startup).

### 2. `src/config/content.ts` — doctors, departments, testimonials, FAQ, stats, timeline

Edit doctor names/photos/schedules, department names/icons, patient testimonials, FAQ answers...

### 3. Admin panel login (per client)

Edit `src/store/adminStore.ts`:
```ts
export const ADMIN_CREDENTIALS = {
  email: 'admin@hospital.com',
  password: 'Admin@2026',
};
```

### 4. Page title

Edit `<title>` and meta description in `index.html`.

---

## 🧑‍⚕️ Admin Panel

Open the site → footer → **Admin Panel** (demo: `admin@hospital.com` / `Admin@2026`)

- **Dashboard** — stats cards + appointments-by-status chart + recent bookings
- **Appointments** — search, filter, change status (pending → confirmed → completed / cancelled)
- **Doctors** — overview of the medical team
- **Messages** — contact-form submissions

---

## 🛠️ Development

```bash
npm install
npm run dev       # development server (port 5174)
npm run build     # production build → dist/
npm run preview   # preview the production build
node scripts/smoke.mjs   # quick rendering test (after build)
```

**Stack:** React 19 + TypeScript + Vite 7 + Tailwind CSS 4 + Framer Motion + Zustand

---

## 📁 Project Structure

```
src/
├── config/
│   ├── site.config.ts     ← 🎨 REBRAND HERE (name, colors, photos, contact)
│   └── content.ts         ← 📝 EDIT CONTENT (doctors, departments, FAQ…)
├── i18n/translations.ts   ← EN + AR UI translations
├── store/                 ← appointments, messages, admin state (localStorage)
├── utils/                 ← booking slots generator, form validation
├── components/            ← Navbar, Footer, cards, sliders, calculators…
└── pages/                 ← Home, About, Departments, Doctors, Booking Wizard,
                             Gallery, Contact, My Appointments, Admin
```

---

## 🇪🇬 دليل سريع بالعربية — إعادة التصميم لكل عميل

1. افتح `src/config/site.config.ts` وغير: **اسم المستشفى، الشعار، الألوان، الصور، بيانات التواصل** — كلها في ملف واحد.
2. افتح `src/config/content.ts` وغير: **الأطباء، الأقسام، صورهم، مواعيدهم، آراء المرضى، الأسئلة الشائعة**.
3. بيانات دخول لوحة الإدارة: `src/store/adminStore.ts`.
4. عنوان الموقع: `index.html`.
5. الألوان تتغير تلقائيًا في كل الموقع من إعدادات `theme` — بدون لمس أي ملف ثاني.

**المميزات:** حجز مواعيد من 4 خطوات مع توليد الأوقات المتاحة، لوحة إدارة للمواعيد والرسائل،
عربي/إنجليزي كامل مع RTL، معرض صور للعميل، حاسبة BMI، زر طوارئ 24/7، سلايدر آراء، أسئلة شائعة.

---

## 📄 License

Commercial template — resell to your own clients after customizing.
