# 📝 Note Taking Application

A full-stack note-taking app built with **React (TypeScript)**, **Node.js (TypeScript)**, and **MongoDB**.

🔗 **Live Demo**: [https://note-takingg.vercel.app/](https://note-takingg.vercel.app/)

## ✅ Features

1. **Sign Up with Email + OTP**

   * Input validations included
   * OTP verification for secure sign-up

2. **Google OAuth Login**

   * One-click sign-up/login using Google
   * Only allowed if user previously signed up via Google

3. **Authentication + Authorization**

   * JWT-based secure user sessions
   * Protected routes for notes operations

4. **Notes Management**

   * Create and delete notes after login
   * Welcome page displays user info and notes

5. **Error Handling**

   * Clear messages for invalid inputs, OTP errors, and API issues

6. **Responsive UI**

   * Matches provided design: [Design Assets](https://hwdlte.com/RvqdLn)
   * Mobile-friendly layout

---

## 🛠 Tech Stack

* **Frontend**: React + TypeScript
* **Backend**: Node.js + Express + TypeScript
* **Database**: MongoDB
* **Auth**: JWT, Google OAuth
* **Email Service**: Nodemailer (SMTP)

---

## 📦 How to Run Locally

### 1. Clone the Repository

```bash
git clone <repo-url>
cd NoteTaking
```

### 2. Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the `server/` folder:

```
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email>
EMAIL_PASS=<your-app-password>
GOOGLE_CLIENT_ID=<your-google-client-id>
FRONTEND_URL=http://localhost:3000
```

### 4. Run the App

```bash
# Start Backend
cd server
npm run dev

# Start Frontend (in a new terminal)
cd ../client
npm start
```

App runs at:

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:5000](http://localhost:5000)

---

## 📄 Notes

* Follows latest versions of all dependencies
* Commits made per feature
* Mobile responsive and design-matched
* JWT protects all user actions
* Ready for deployment and submission

---

**📤 Deployed App:**
🔗 [https://note-takingg.vercel.app/](https://note-takingg.vercel.app/)
