# College Club Management Portal
A full-stack MERN application designed to bridge the gap between college clubs and students. This portal allows students to discover campus activities, register for events, and manage their participation through a personalized, real-time dashboard.

## Key Features
- **User Authentication**: Secure Sign Up and Login system with persistent sessions using LocalStorage and the React Context API.

- **Event Discovery**: Browse a dynamic list of upcoming club events with real-time registration status.

- **Personal Dashboard (MyEvents)**: A private, filtered view for logged-in users to track and manage all events they have successfully registered for.

- **Dynamic UI Logic**: Responsive design with complex conditional rendering (e.g., automatically switching between "Register" and "Already Registered" states based on user data).

- **RESTful API**: Robust backend integration for managing CRUD operations on user profiles and event registrations.

## Tech Stack

- **Frontend**: React.js (Hooks, Context API, Router) 
- **Backend**: Node.js & Express.js Database: MongoDB (Managed via MongoDB Compass)
  
## Installation & Setup
Follow these steps to get the project running on your local machine.

1. **Database Configuration**
    - Open MongoDB Compass.
    - Connect to your local or remote cluster.
    - Ensure your database and collections (Users, Events) are initialized.

2. **Clone the repository**
   git clone https://github.com/Diya-BR/mern-club-management-system.git
   cd mern-club-management-system

3. **Start the Backend**
   - Navigate to the backend folder: cd backend
   - Install dependencies: npm install
   - Start the server:
     node backend.js

4. **Start the Frontend**
   - Open a new terminal and navigate to the frontend folder: cd frontend
   - Install dependencies: npm install
   - Start the development server:
     npm run dev
