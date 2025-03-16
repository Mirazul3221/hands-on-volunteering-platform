# handsone-project#
Project Overview
============
handsone is a Community-Driven Social Volunteering Platform, where a user can create an account using his name, email and password.
After creating account a user can post an event for community help. The other users can join by a join button, if they are intersted.
Desides, a user can upload his profile picture, update his bio. Like creating event a user can create a group for long time project.

This project is a full-stack web application built with React.js on the frontend and Node.js with Express.js on the backend. It provides a secure authentication system using JWT and allows users to interact with a database-driven system. The application ensures seamless communication between the frontend and backend while offering a user-friendly experience.

![sample](https://raw.githubusercontent.com/Mirazul3221/hands-on-volunteering-platform/refs/heads/main/Screenshot_7.png)

Technologies Used
=================
The project utilizes the following technologies:

Frontend:

React.js (for building dynamic UI)

React Router (for client-side navigation)

Axios (for API requests)

Tailwind CSS / Bootstrap (for styling)


Backend:

Node.js (JavaScript runtime)

Express.js (lightweight web framework)

JWT (for authentication and user security)

Bcrypt (for password hashing)

dotenv (for environment variable management)



 Setup Instructions
 ===================
 Step 1: Clone the Repository

 git clone https://github.com/Mirazul3221/hands-on-volunteering-platform

 cd hands-on-volunteering-platform



Step 2: Install Dependencies

For Frontend:

cd handsone-frontend

npm install

npm run dev



For Backend:


make sure the .env file setup correctly

.env setup

PORT=5000

 MONGO_URI=mongodb://localhost:27017/handson

JWT_SECRET=55trbdth

#this app uses cloudinary for media file handle

CLOUD_NAME= df5rvx2id

API_KEY = 514549976724715

API_SECRET = QZUvqrDHEpzepzrHe_1uk69z9ng



cd handsone-backend

npm install

npm run dev


Step 3: Configure Environment Variables

Create a .env file in the backend directory and add:


I have deployed this project on vercel the live link is below:

Frontend: https://handson-volunteering-platform.vercel.app/

backend : https://handson-backend-sigma.vercel.app/
