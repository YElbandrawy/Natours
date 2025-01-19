# Natours

Natours is a feature-rich, high-performance web application for booking nature tours. Designed with modern web technologies.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)

---

## Features

- User authentication and authorization (sign-up, login, roles).
- Browse and search for tours.
- Book tours and manage reservations.
- Interactive map with tour locations.
- User profile management.
- Secure payments integration.

## Technologies Used

### Backend

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB.
- **JWT**: Authentication using JSON Web Tokens.
- **Stripe**: Payment processing.

### Frontend

- **HTML5** and **CSS3**: Static templates and styling.
- **JavaScript (ES6)**: Dynamic frontend functionality.

### DevOps

- **Git**: Version control.
- **Postman**: API testing and documentation.
- **Railway**: Deployment.

---

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/YElbandrawy/Natours.git
   cd Natours
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory and configure the following variables:

   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE=<your_mongodb_connection_string>
   DATABASE_PASSWORD=<your_database_password>
   JWT_SECRET=<your_jwt_secret>
   JWT_EXPIRES_IN=90d
   EMAIL_USERNAME=<your_email_service_username>
   EMAIL_PASSWORD=<your_email_service_password>
   STRIPE_SECRET_KEY=<your_stripe_secret_key>
   ```

4. **Start the Server**

   - Development Mode:

     ```bash
     npm start
     ```

   - Production Mode:
     ```bash
     npm start:prod
     ```

5. **Access the Application**

   Navigate to `http://localhost:3000` in your browser.

---

## Usage

1. **Browse Tours**

   - View available tours on the homepage.
   - Use filters to search for specific tours.

2. **Book a Tour**

   - Select a tour and complete the booking process.
   - Payments are securely handled via Stripe.

3. **Manage Account**

   - Update user details, including password and email.
   - View and manage bookings.

4. **Admin Features**
   - Create, update, or delete tours.
   - Manage user roles and access rights.

---

## Project Structure

```plaintext
Natours/
├── controllers/     # Business logic for the app.
├── models/          # Mongoose schemas and models.
├── public/          # Static assets (CSS, images, etc.).
├── routes/          # Express route handlers.
├── utils/           # Utility functions (error handling, email, etc.).
├── views/           # HTML templates with Pug.
├── app.js           # App entry point and middleware setup.
├── server.js        # Server initialization.
└── README.md        # Documentation.
```

---

## API Documentation

⚙️ Working on it, stay tuned 😃.
