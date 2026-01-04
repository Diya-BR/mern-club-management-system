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

     
Here are a few screenshots of the web application:

<img width="948" height="403" alt="image" src="https://github.com/user-attachments/assets/4245339c-ee19-4c1d-814a-bc293c5db7c3" />

<img width="946" height="404" alt="image" src="https://github.com/user-attachments/assets/34a67133-2bae-4806-8ed1-4e5c73418319" />

<img width="695" height="434" alt="image" src="https://github.com/user-attachments/assets/83f786e8-d68a-4ad9-bd18-7fdf93a36e3f" />

<img width="947" height="403" alt="image" src="https://github.com/user-attachments/assets/c89fe691-bb55-41ed-bf68-179c99ea704a" />

<img width="331" height="103" alt="image" src="https://github.com/user-attachments/assets/be981f76-4eb8-4e92-af99-e23f72a58dd5" />

<img width="946" height="404" alt="image" src="https://github.com/user-attachments/assets/cc529e48-65da-46fb-bbe4-5768dc3076e8" />

<img width="944" height="402" alt="image" src="https://github.com/user-attachments/assets/093e404c-d30d-414f-83c4-dfed7e1ea96e" />

<img width="947" height="398" alt="image" src="https://github.com/user-attachments/assets/64ac192e-6b0f-47ce-b7bc-32c515e5aedc" />



