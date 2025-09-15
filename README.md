<img width="598" height="861" alt="image" src="https://github.com/user-attachments/assets/2d35ea38-6b4b-4a21-a1dd-6037651669cd" />
Mini CRM Platform for Xeno SDE Internship
This is a modern, full-stack Mini CRM (Customer Relationship Management) platform built as part of the Xeno SDE Internship assignment. It features an AI-powered audience segmentation tool, asynchronous data processing, and a complete campaign management workflow, all deployed on a scalable, multi-cloud infrastructure.

🚀 Live Demo
Frontend Application: https://xeno-sde-internship-2025-y5c6.vercel.app

Backend API Server: https://xeno-sde-internship-2025.onrender.com

(Note: The free-tier services may take a moment to "wake up" on the first visit.)

✨ Key Features
Asynchronous Data Ingestion: Scalable API endpoints for adding customers and orders using a RabbitMQ message queue, ensuring the API remains fast and responsive.

AI-Powered Audience Segmentation: Integrates with the Google Gemini API to translate natural language prompts (e.g., "high-value customers who are inactive") into complex, structured database queries.

Dynamic Rule Builder: A flexible UI for manually creating customer segments with multiple rules using AND/OR logic.

Live Audience Preview: Real-time calculation of the number of customers matching the defined rules without launching a campaign.

Asynchronous Campaign Delivery: A complete workflow to create and launch marketing campaigns. Message delivery is handled by a background worker, simulating interaction with a third-party vendor.

Campaign History & Statistics: A dashboard to view all past campaigns and their real-time delivery statistics (Total, Sent, Failed).

Secure Authentication: The platform is protected by Google OAuth 2.0, ensuring only authenticated users can manage data and campaigns.

🏗️ System Architecture
The application is built on a decoupled, multi-service architecture designed for scalability and resilience. Each component is deployed to a service best suited for its role.

<details>
<summary>Click to view the detailed System Architecture Diagram</summary>

</details>

🛠️ Tech Stack
Category

Technology

Frontend

React.js (with Vite), React Router, Axios, Framer Motion, Lucide React

Backend

Node.js, Express.js

Database

MongoDB (with Mongoose)

Authentication

Passport.js (Google OAuth 2.0 Strategy), Express Session

Asynchronous Processing

RabbitMQ

AI Integration

Google Gemini API

Deployment

Frontend: Vercel, API: Render, Worker: Railway, DB: MongoDB Atlas, Queue: CloudAMQP

⚙️ Local Development Setup
To run this project on your local machine, follow these steps.

Prerequisites
Node.js (v18 or later)

npm

A local installation of MongoDB

A local installation of RabbitMQ

1. Clone the Repository
git clone [https://github.com/Kaustubh1235/xeno-sde-internship-2025.git](https://github.com/Kaustubh1235/xeno-sde-internship-2025.git)
cd xeno-sde-internship-2025

2. Install Dependencies
You need to install dependencies for both the server and client directories.

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

3. Configure Environment Variables
Create a .env file in both the server and client directories.

server/.env:

# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/xeno-crm

# Google OAuth Credentials
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET

# Google Gemini API Key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# Session Cookie Secret
COOKIE_KEY=averysecretkeyforproduction

# RabbitMQ Connection URL
CLOUDAMQP_URL=amqp://guest:guest@localhost:5672

# URLs for development
BACKEND_URL=http://localhost:8000
CLIENT_URL=http://localhost:5173

client/.env:

VITE_API_BASE_URL=http://localhost:8000

4. Run the Application
Open two separate terminals to run the backend and frontend concurrently.

Terminal 1 (Backend):

cd server
npm start

Terminal 2 (Frontend):

cd client
npm run dev

