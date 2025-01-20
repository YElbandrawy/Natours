# Natours

Natours is a feature-rich, high-performance web application for booking tours, built using **Express.js** and **MongoDB**. It includes features like user authentication, tour browsing, booking management, and **payment processing via Stripe**. The app also offers an **interactive map**, user profile management, and admin capabilities for managing tours and users.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Data models Documentation](#data-models-documentation)
- [Contact the Author](#contact-the-author)

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
- **MongoDB**: NoSQL database.
- **Atlas**: Cloud data storage.
- **Mongoose**: ODM for MongoDB.
- **JWT**: Authentication using JSON Web Tokens.
- **Stripe**: Payment processing.

### Frontend

- **Pug** and **CSS**: Static templates and styling.
- **JavaScript (ES6)**: Dynamic frontend functionality.

### DevOps

- **Git**: Version control.
- **Postman**: API testing and documentation.
- **Railway**: Deployment.

---

<p align='center'>
<a target="_blank" href="https://stripe.com" style="display: inline-block;">
  <img src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" alt="stripe" width="55" height="45" />
</a>
<a target="_blank" href="https://pugjs.org" style="display: inline-block;">
  <img src="https://cdn.worldvectorlogo.com/logos/pug.svg" alt="Pug" width="55" height="55" />
</a>
<a target="_blank" href="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" style="display: inline-block;"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="55" height="55" /></a>
<a target="_blank" href="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" style="display: inline-block;"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="55" height="55" /></a>
<a target="_blank" href="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" style="display: inline-block;"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb" width="55" height="55" /></a>
<a target="_blank" href="https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg" style="display: inline-block;"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg" alt="linux" width="55" height="55" /></a>
<a target="_blank" href="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" style="display: inline-block;"><img src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" alt="git" width="55" height="55" /></a>
<a target="_blank" href="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" style="display: inline-block;"><img src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" alt="postman" width="55" height="55" /></a>
<a target="_blank" href="https://raw.githubusercontent.com/devicons/devicon/master/icons/railway/railway-original.svg" style="display: inline-block;"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/railway/railway-original.svg" alt="railway" width="55" height="55" /></a>
</p>

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
   JWT_COOKIE_EXPIRESIN=3

   EMAIL_PLATFORM=<mailtrap_or_brevo>
   SENDEREMAIL=<Your_Email>

   EMAIL_HOST=sandbox.smtp.mailtrap.io
   EMAIL_TOKEN=<your_mailtrap_token>
   EMAIL_USERNAME=<your_mailtrap_username>
   EMAIL_PASSWORD=<your_mailtrap_password>

   BREVO_HOST=<your_brevo_host>
   BREVO_PORT=<your_brevo_port>
   BREVO_LOGIN=<your_brevo_login>
   BREVO_PASSWORD=<your_brevo_password>

   STRIPE_SECRET=<your_stripe_secret_key>
   ```

4. **Import Development Data to MongoDB Atlas**

   - using `loadDataScript.js` at `dev-data/data`

   ```bash
      node dev-data/data/loadDataScript.js --clear
      node dev-data/data/loadDataScript.js --import
   ```

5. **Start the Server**

   - Development Mode:

     ```bash
     npm run start:dev
     ```

   - Production Mode:
     ```bash
     npm run start:prod
     ```

6. **Access the Application**

   Navigate to `http://localhost:3000/` in your browser.

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

**[documentation🔗](https://documenter.getpostman.com/view/38019494/2sAYQcEA1R)**

## Data models Documentation

**[models/Readme.md](models/Readme.md)**

## Contact the Author

**Find me on social media**

- **[LinkedIn 📭](https://www.linkedin.com/in/youssef-elbandrawy)**
