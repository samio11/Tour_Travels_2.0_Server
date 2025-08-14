# Tour Travels 2.0 - Backend API

![Version](https://img.shields.io/badge/Version-2.0-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-v20-blue) ![Express.js](https://img.shields.io/badge/Express.js-v4.18-green) ![MongoDB](https://img.shields.io/badge/MongoDB-v8-yellow) ![License](https://img.shields.io/badge/License-ISC-red)
![tour1](https://github.com/user-attachments/assets/7ed0327f-f167-4fcf-8be7-6f4c46f54a75)


Welcome to **Tour Travels 2.0**, a powerful and scalable backend API designed to support a modern tour booking platform. This API provides comprehensive functionality for user authentication, tour management, booking creation, secure payment processing, and administrative tasks. Built with security, performance, and developer experience in mind, it leverages modern technologies to deliver a seamless experience for travelers, developers, and administrators.

Whether you're building a frontend travel application or managing tour operations, this API serves as a robust foundation for creating unforgettable travel experiences.



## Features
- **Secure Authentication**: Supports JWT-based login, OTP email verification, password management, and role-based access (User, Admin, Super Admin).
- **Tour Management**: Create, retrieve, and manage tour types and individual tours with details like title, slug, cost, and division associations.
- **Booking System**: Enables users to create, view, and delete bookings with guest count support and status tracking (Pending, Complete, Fail, Cancel).
- **Payment Processing**: Integrates SSLCommerz for secure payments, handling initialization, success, failure, and cancellation scenarios.
- **Email & OTP Notifications**: Sends OTPs for verification and templated emails for booking confirmations, account verifications, and updates.
- **Admin Capabilities**: Allows admins to fetch all users, tours, bookings, and divisions with advanced querying (filtering, searching, sorting, pagination).
- **Robust Error Handling**: Implements custom error handling with AppError, schema validation with Zod, and transactional operations for bookings/payments.
- **Query Builder**: Provides a flexible QueryBuilder utility for dynamic data retrieval with filtering, searching, sorting, and pagination.

## Technologies Used
The project is built with a modern and reliable tech stack:

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT), Bcrypt for password hashing, Passport.js (Local & Google OAuth)
- **Payment Gateway**: SSLCommerz API
- **Email Service**: Nodemailer with EJS templates for dynamic emails
- **Caching**: Redis for OTP storage
- **File Uploads**: Multer with Cloudinary for media storage
- **Validation**: Zod for schema validation
- **Utilities**: Axios, Cookie-Parser, CORS, Dotenv, Crypto for OTP generation

See `package.json` for a complete list of dependencies.

## Installation
Follow these steps to set up and run the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/tour-travels-2.0.git
   cd tour-travels-2.0
   npm install
## set .env file
