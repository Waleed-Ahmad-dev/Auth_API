# Auth API

[![Auth API](https://img.shields.io/badge/AuthAPI-v1.0-blue?style=for-the-badge)](https://github.com/Waleed-Ahmad-dev/Auth_API)
[![Node.js](https://img.shields.io/badge/Node.js-v16.x-green?style=for-the-badge)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-orange?style=for-the-badge)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v4.x-blue?style=for-the-badge)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-v8.x-blue?style=for-the-badge)](https://www.mysql.com/)

An advanced **authentication API** built with **Node.js** and **Express.js**, utilizing **Prisma** ORM for database interaction, **MySQL** as the database, and **JWT** for secure token-based authentication. The API is entirely written in **TypeScript** for enhanced reliability and maintainability.

---

## 🚀 Features

- 🛡️ **User Authentication**: Secure registration and login.
- 🔐 **JWT-based Authentication**: Stateless and secure.
- 📦 **Prisma ORM**: Simplified database interaction with MySQL.
- 🔑 **Password Hashing**: Securely hashed passwords using bcrypt.
- 📂 **Environment Variables**: Managed using dotenv.
- ⚙️ **TypeScript Integration**: Ensures type safety, better error handling, and cleaner code.

---

## 🛠️ Technologies Used

| **Technology** | **Version**  | **Purpose**                                      |
|----------------|--------------|--------------------------------------------------|
| [Node.js](https://nodejs.org/) | v16.x        | Backend runtime environment                      |
| [Express.js](https://expressjs.com/) | v4.x         | Web framework for building APIs                 |
| [Prisma](https://www.prisma.io/) | v4.x         | ORM for database interaction with MySQL         |
| [MySQL](https://www.mysql.com/) | v8.x         | Relational database for storing user data       |
| [TypeScript](https://www.typescriptlang.org/) | v4.x         | Strongly typed JavaScript for better reliability|
| [Bcrypt](https://www.npmjs.com/package/bcrypt) | v5.x         | Password hashing library                        |
| [JWT](https://jwt.io/) | v8.x         | Secure token-based authentication               |
| [Dotenv](https://www.npmjs.com/package/dotenv) | v16.x        | Environment variable management                 |

---

## 📦 Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Waleed-Ahmad-dev/Auth_API.git
   cd Auth_API
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/database_name"
   JWT_SECRET="your_secret_key"
   ```
   Replace `username`, `password`, and `database_name` with your MySQL credentials.

4. **Apply Prisma Migrations**:
   ```bash
   npx prisma migrate dev
   ```

5. **Start the Server**:
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:3000`.

---

## 🧩 API Endpoints

### Authentication Endpoints

#### 📝 Register a User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "number",
      "username": "string",
      "email": "string"
    }
  }
  ```

#### 🔑 Login a User
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate a user and return a JWT.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "string"
  }
  ```

### Protected Routes

#### 🔒 Get User Profile
- **Endpoint**: `GET /api/auth/profile`
- **Description**: Retrieve the authenticated user's profile.
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <token>"
  }
  ```
- **Response**:
  ```json
  {
    "id": "number",
    "username": "string",
    "email": "string"
  }
  ```

---

## 📂 Project Structure

```
Auth_API/
├── prisma/
│   └── schema.prisma    # Prisma schema definition
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Middleware functions
│   ├── models/          # Database models
│   ├── routes/          # API route definitions
│   ├── services/        # Service layer for business logic
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript type definitions
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
├── package.json          # Node.js dependencies
├── README.md             # Project documentation
└── server.ts             # Entry point of the application
```

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add a new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### 📞 Contact
- **Email**: itswaleedqureshi@gmail.com
- **GitHub**: [Waleed Ahmad](https://github.com/Waleed-Ahmad-dev)

---

Happy coding! 🚀
