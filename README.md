````md
# Testing Backend

A clean and minimal Node.js + TypeScript backend boilerplate designed for quick project startup using MongoDB (NoSQL) as the database.

## Tech Stack

- **Node.js**
- **TypeScript**
- **Express**
- **MongoDB** (via Mongoose)
- **JWT (jsonwebtoken)**
- **bcrypt**
- **dotenv**
- **nodemailer**

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd testing-backend
```
````

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### 4. Start development server

```bash
npm run dev
```

## Project Structure

```
.
├── index.ts
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
└── src
    ├── config
    │   └── db.ts
    ├── controllers
    │   └── user
    │       ├── auth.controler.ts
    │       ├── password.controler.ts
    │       └── user.controler.ts
    ├── middlewares
    │   └── auth.middleware.ts
    ├── models
    │   └── user.model.ts
    ├── routes
    │   └── user.routes.ts
    └── utils
        ├── generatetoken.ts
        ├── response.ts
        ├── sendcode.ts
        └── sendpassword.ts
```

## Available Scripts

| Command       | Description               |
| ------------- | ------------------------- |
| `npm run dev` | Starts development server |
| `npm test`    | Placeholder test script   |
