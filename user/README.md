# 💌 Confessions – Anonymous Confession Platform

A secure and anonymous confession platform built exclusively for the students of **Sambalpur University Institute of Information Technology (SUIIT)**. Students can share their thoughts, feelings, secrets, and experiences anonymously after verifying their institutional email address.

## 🌟 Features

### 👤 User Features
- **Institutional Email Verification:** Only users with a valid `@suiit.ac.in` email address can access the confession form.
- **Email Authentication:** Verification link sent to the registered institutional email.
- **Time-Limited Verification:** Verification links expire after a short validity period (approximately 1–1.5 minutes).
- **Anonymous Confessions:** Submit confessions without revealing your identity.
- **Simple Submission Process:** A clean and user-friendly interface for sharing confessions.
- **Thank You Screen:** Confirmation after successfully submitting a confession.

### 🔐 Admin Features
- Secure admin login.
- View all submitted confessions.
- Delete inappropriate or unwanted confessions.
- Manage confession submissions through an admin dashboard.

### 🛡️ Privacy & Security
- Restricted access to `@suiit.ac.in` email addresses.
- Email verification before confession submission.
- Confession content is stored in the database rather than emailed to administrators or users.
- Environment variables used to protect sensitive credentials.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| Nodemailer | Email verification |
| Google SMTP | Sending verification emails |
| Axios | API communication |
| CSS / Material UI | User interface |

## 📂 Project Structure

```text
CONFESSIONS/
│
├── user/                   # User frontend
│   ├── public/
│   ├── src/
│   └── package.json
│
├── server/                 # Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── package.json
│
├── .gitignore
└── README.md
```

*Note: Update the folder structure if your actual project differs.*

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/USERNAME/CONFESSIONS.git
cd CONFESSIONS
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password
APP_URL=http://localhost:3000
```

Add any other environment variables required by your backend.

Start the backend:

```bash
npm start
```

### 3. Setup Frontend

Open another terminal:

```bash
cd user
npm install
```

Configure your frontend API URL according to your backend configuration.

Start the frontend:

```bash
npm start
```

The application will be available at:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## 🚀 Deployment

The application can be deployed using:

| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |
| Google SMTP | Email verification |

Configure the required environment variables in the respective hosting platforms before deployment.

## 🔄 Application Workflow

1. A student visits the website.
2. Enters their institutional email address.
3. Receives an email verification link.
4. Verifies their email within the validity period.
5. Gets access to the confession submission form.
6. Submits an anonymous confession.
7. The confession is stored in MongoDB.
8. The admin can view and manage submitted confessions.

## 🔮 Future Enhancements

- Like and reaction system for confessions.
- Confession categories.
- Search and filtering functionality.
- Improved admin moderation tools.
- Report inappropriate content.
- Enhanced privacy and security mechanisms.

## 👨‍💻 Developer

Developed with ❤️ for the students of **SUIIT**.

**Project:** Confessions – Anonymous Confession Platform

**Institution:** Sambalpur University Institute of Information Technology (SUIIT)

---

*Share your thoughts. Express your feelings. Stay anonymous.*

