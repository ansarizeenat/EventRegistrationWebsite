# 🎓 CampusConnect 2027 - College Event Registration & Multi-Billing System
**Jana Seva Sangh's Shri Ram College, Bhandup (W), Mumbai**

CampusConnect 2027 is a full-stack, responsive web application for college event management featuring multi-event student registration, real-time itemized billing calculation, strict input validation, instant printable invoice passes, student login portal, and an admin management dashboard.

---

## ✨ Features Added & Upgraded

### 1. 📅 12 Exciting Events (Year 2027)
- **TechSpark 2027** (Hackathon & Web Coding) - ₹250 (15 Feb 2027)
- **AI & Robotics Expo 2027** (Generative AI & Robo-Wars) - ₹300 (20 Feb 2027)
- **Tarang Cultural Fest 2027** (Dance, Drama & Fashion Show) - ₹200 (26 Feb 2027)
- **Inter-College Sports Meet 2027** (Cricket, Football, Athletics) - ₹150 (5 Mar 2027)
- **Startup & Entrepreneurship Summit 2027** (Shark Tank Pitching) - ₹200 (12 Mar 2027)
- **Esports Battleground 2027** (BGMI & Valorant LAN Tournament) - ₹200 (18 Mar 2027)
- **PixelCraft Photography & Film 2027** (Reel & Photo Contest) - ₹100 (24 Mar 2027)
- **Poster & Art Competition 2027** (Canvas & Digital Art) - ₹100 (2 Apr 2027)
- **Cyber Security & Ethical Hacking Bootcamp 2027** - ₹350 (10 Apr 2027)
- **Voice of Campus 2027** (Battle of Bands & Singing) - ₹150 (18 Apr 2027)
- **National MindQuest Quiz & Debate 2027** - ₹100 (25 Apr 2027)
- **Cloud & Web3 Masterclass 2027** (AWS & Blockchain) - ₹250 (2 May 2027)

### 2. 🧾 Multi-Event Selection & Live Billing System
- Students can select **multiple events simultaneously** using interactive checkboxes.
- Dynamic Order Summary Card calculates:
  - Subtotal based on selected events
  - 10% Multi-Event Student Discount (applied automatically when 2+ events are chosen)
  - Net Total Payable Amount (₹)
- Instant Official E-Pass / Printable Invoice Receipt with unique reference ID (`CC-2027-XXXX`), barcode simulation, and Print button.

### 3. 🛡️ Strict Column-by-Column Form Validation
- **Email Validation**: Strict regex check. If format is wrong (e.g. missing `@` or domain), displays: `Invalid email address! Please enter a valid email like name@example.com`.
- **Phone Number Validation**: Strict 10-digit check. If 9 digits are entered, displays: `Invalid phone number! Must be exactly 10 digits (you entered 9 digits)`.
- **Full Name**: Minimum 3 alphabetic characters.
- **College & Course**: Mandatory validation.
- **Event Selection**: Prevents submission if no event is checked.
- Real-time visual feedback: Red border and error message on invalid input, green border on valid input.

### 4. 🔑 Student Pass Portal & Admin Login
- **Student Login**: Lookup all booked events and re-print receipts anytime using registered email or mobile phone.
- **Admin Login**: Secure login with credentials (`admin` / `admin123`).
- **Admin Dashboard**:
  - Real-time counters: Total Students, Total Event Passes, Total Revenue (₹), Participating Colleges.
  - Search & filter records by student name, college, event, or ID.
  - **Export to Excel/CSV** button for downloading student lists.
  - View individual invoice receipts and delete records.

### 5. 🗄️ Resilient Dual-Mode Database
- Automatically connects to **MongoDB Atlas**.
- If MongoDB is temporarily unreachable or DNS is blocked, it seamlessly falls back to a persistent JSON store (`data/registrations.json`).

---

## 🚀 How to Run Locally

1. Open Terminal / PowerShell in the project folder:
   ```bash
   cd "C:\Users\Zeenat f ansari\OneDrive\ドキュメント\EventRegistrationWebsite"
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. Open your browser and visit:
   ```
   http://localhost:3000
   ```

---

## 🌐 How to Deploy (Online Hosting)

### Option 1: Deploy on Render.com (Recommended - 100% Free)
1. Push this project folder to your GitHub repository (or create a new GitHub repo called `campusconnect-2027`).
2. Go to [Render.com](https://render.com) and sign up / log in with GitHub.
3. Click **New +** -> **Web Service**.
4. Connect your `campusconnect-2027` GitHub repo.
5. Settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`
6. (Optional) In **Environment Variables**, add:
   - `MONGODB_URI`: your MongoDB Atlas connection string.
7. Click **Deploy Web Service**! In 2 minutes, your website will be live on `https://campusconnect-2027.onrender.com`.

### Option 2: Deploy on Vercel
1. Install Vercel CLI or go to [Vercel.com](https://vercel.com).
2. Import your GitHub repository.
3. Vercel will automatically detect `vercel.json` and deploy it instantly.

---

## 👥 Default Credentials
- **Admin Username**: `admin`
- **Admin Password**: `admin123`
- **Student Portal**: Enter any registered student's email or phone number (e.g. `aarav.sharma@gmail.com` or `zeenat.ansari@gmail.com`).
