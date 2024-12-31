# Auth API

An authentication API built with Node.js and Express.js, using Prisma as the ORM, MySQL as the database, and JWT for secure authentication.

## Features

- User registration
- User login
- Token-based authentication (JWT)
- Prisma ORM integration with MySQL
- Secure password hashing using bcrypt
- Environment variable management using dotenv
- Modular and scalable code structure

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side API.
- **Express.js**: Minimalist web framework for building robust APIs.
- **Prisma**: ORM for database interaction with MySQL.
- **MySQL**: Relational database for storing user data.
- **JWT**: Secure token-based authentication.
- **Bcrypt**: For hashing and comparing passwords.
- **Dotenv**: To manage environment variables.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Waleed-Ahmad-dev/Auth_API.git
   cd Auth_API
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/database_name"
   JWT_SECRET="your_secret_key"
   ```

   Replace `username`, `password`, and `database_name` with your MySQL credentials and database name.

4. Apply Prisma migrations to set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the server:
   ```bash
   npm start
   ```

   The API will be available at `http://localhost:3000`.

## API Endpoints

### Authentication Endpoints

#### Register a User
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

#### Login a User
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

#### Get User Profile
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

## Project Structure

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
│   └── utils/           # Utility functions
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
├── package.json          # Node.js dependencies
├── README.md             # Project documentation
└── server.js             # Entry point of the application
```

## How to Contribute

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

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy coding! 🚀
