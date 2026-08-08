# A2Z Plant Nutrient — Website

The official website for **A2Z Plant Nutrient Private Limited** — Landscaping, Plantation, and Indoor Plant services in Varanasi.

Built with **Next.js 14 (App Router)**, **Tailwind CSS**, and **lucide-react** icons.

---

## ✨ Features

- Modern responsive design with Tailwind CSS
- Multi-page site: Home, About, Services, Gallery, Blog, Gifting, Careers, Contact
- Image-rich gallery with lightbox preview
- Job application form (Careers)
- WhatsApp / Call floating action buttons
- Toast notifications (gifting enquiries, applications)
- SEO-friendly with Next.js metadata API

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── layout.jsx          # Root layout (Header, Footer, FloatingActions)
│   ├── page.jsx            # Home page
│   ├── about/page.jsx
│   ├── services/page.jsx
│   ├── gallery/page.jsx
│   ├── blog/page.jsx
│   ├── gifting/page.jsx
│   ├── careers/page.jsx
│   ├── contact/page.jsx
│   └── globals.css         # Tailwind + custom CSS
├── components/             # Shared components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── PageHero.jsx
│   ├── FloatingActions.jsx
│   └── ui/                 # UI primitives (Button, Card, Input, ...)
├── hooks/
│   └── use-toast.js
├── lib/
│   ├── mock.js             # Site content (company info, services, blog, etc.)
│   └── utils.js
├── public/                 # Static assets
├── tailwind.config.js
├── next.config.mjs
└── package.json
```

---

## 🎨 Customization

Edit `lib/mock.js` to update:
- Company info (name, phone, email, address)
- Navigation links
- Services, Blog posts, Testimonials
- Gallery images, Gift items, Career listings

---

## 📦 Deployment

This project is ready to deploy on:
- **Vercel** (recommended for Next.js) — `vercel deploy`
- **Netlify** — works out of the box
- Any Node.js host — run `npm run build` then `npm start`

---

## 📞 Contact

- **Phone:** +91 81605 34604
- **Email:** a2zplantnutrient@gmail.com
- **Address:** 13A Shyam Bihar Colony, Laharata Road, Varanasi, Uttar Pradesh 221103

---

© A2Z Plant Nutrient Private Limited. All rights reserved.
