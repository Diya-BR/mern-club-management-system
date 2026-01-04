import express from "express";
import { MongoClient, ObjectId } from "mongodb"; 

const app = express();
const port = 5001;
const url = "mongodb://localhost:27017";
const dbName = "Clubs";

let eventsCollection;
let usersCollection; 

app.use(express.json());

MongoClient.connect(url)
  .then(client => {
    console.log("Connected to MongoDB");
    const db = client.db(dbName);
    eventsCollection = db.collection("AllEvents");
    usersCollection = db.collection("Users"); 

    // Insert sample events if collection is empty
    const events = [ 
      { "id": "e1", "name": "Tech Workshop", "club": "Coding Club", "description": "A hands-on workshop on React.js and modern web development.", "date": "2025-11-15", "time": "14:00", "venue": "Lab 101", "image": "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg", "ended": false },
      { "id": "e2", "name": "Art Exhibition", "club": "Art Club", "description": "Showcase of student artwork and installations.", "date": "2025-11-10", "time": "10:00", "venue": "Art Gallery", "image": "https://plus.unsplash.com/premium_photo-1706388658576-77fbaff13ffe?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXhoaWJpdGlvbnxlbnwwfHwwfHx8MA%3D%3D&lib=rb-4.1.0&q=60&w=3000", "ended": true },
      { "id": "e3", "name": "Music Concert", "club": "Music Club", "description": "Live performances by college bands and solo artists.", "date": "2025-11-20", "time": "18:00", "venue": "Auditorium", "image": "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg", "ended": false },
      { "id": "e4", "name": "Coding Competition", "club": "Coding Club", "description": "Solve algorithmic challenges and win prizes.", "date": "2025-11-18", "time": "09:00", "venue": "Computer Lab", "image": "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg", "ended": false },
      { "id": "e5", "name": "Drama Night", "club": "Drama Club", "description": "An evening of short plays and improvisations.", "date": "2025-11-12", "time": "19:00", "venue": "Auditorium", "image": "https://media.gettyimages.com/id/157308942/photo/theater-neon-sign.jpg?s=2048x2048&w=gi&k=20&c=-P5GRfZLSLK9OOHGjO-6rqF6siAqKmqPUmaGyZL4s7Y=", "ended": true } 
    ];
    eventsCollection.countDocuments().then(count => {
      if (count === 0) eventsCollection.insertMany(events).then(res => console.log(`${res.insertedCount} events inserted`));
    });

    app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));

// CORS Configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Ensure this matches your React dev server port
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => res.send("Welcome to the Clubs Events API!"));
// POST /signup route
app.post("/signup", async (req, res) => {
  if (!usersCollection) return res.status(500).json({ message: "MongoDB not connected yet" });
  
  const { name, gender, email, phoneNumber, password } = req.body;

  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const newUser = {
      name, gender, email, phoneNumber,
      password, // Stored in plain text
      registeredEvents: [], 
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);
    
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Error during user registration", error: err.message });
  }
});

// POST /login route
app.post("/login", async (req, res) => {
  if (!usersCollection) return res.status(500).json({ message: "MongoDB not connected yet" });
  
  const { email, password } = req.body;

  try {
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials (Email not found)" });
    }

    // Plain text password comparison
    const isMatch = (password === user.password); 
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials (Wrong password)" });
    }

    const userPayload = {
      _id: user._id, // Send MongoDB's ID to the frontend
      name: user.name,
      email: user.email,
    };
    
    res.json({ message: "Login successful", user: userPayload });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error during login", error: err.message });
  }
});

// --- Event Registration Routes ---

// POST /register-event route
app.post("/register-event", async (req, res) => {
  if (!usersCollection || !eventsCollection) return res.status(500).json({ message: "DB not connected" });
  
  const { userId, eventId } = req.body;

  try {
    const userObjectId = new ObjectId(userId);

    const updateResult = await usersCollection.updateOne(
      { _id: userObjectId },
      { $addToSet: { registeredEvents: eventId } } 
    );

    if (updateResult.modifiedCount === 0 && updateResult.matchedCount > 0) {
        return res.status(409).json({ message: "Already registered for this event" });
    }
    
    if (updateResult.matchedCount === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Error during event registration", error: err.message });
  }
});

// GET /myevents-ids/:userId route (For the Events page to check status efficiently)
app.get("/myevents-ids/:userId", async (req, res) => {
    if (!usersCollection) return res.status(500).json({ message: "DB not connected" });
    
    const { userId } = req.params;

    try {
        const user = await usersCollection.findOne(
            { _id: new ObjectId(userId) },
            { projection: { registeredEvents: 1, _id: 0 } }
        );

        if (!user || !user.registeredEvents) {
            return res.json([]);
        }

        res.json(user.registeredEvents); 

    } catch (err) {
        console.error("Fetching myevents IDs error:", err);
        res.status(500).json({ message: "Error fetching user event IDs", error: err.message });
    }
});

// GET /myevents/:userId route (For the MyEvents page to get full event details)
app.get("/myevents/:userId", async (req, res) => {
    if (!usersCollection || !eventsCollection) return res.status(500).json({ message: "DB not connected" });
    
    const { userId } = req.params;

    try {
        const user = await usersCollection.findOne(
            { _id: new ObjectId(userId) },
            { projection: { registeredEvents: 1 } }
        );

        if (!user || !user.registeredEvents || user.registeredEvents.length === 0) {
            return res.json([]);
        }

        const eventObjectIds = user.registeredEvents.map(id => new ObjectId(id));

        const registeredEvents = await eventsCollection.find({
            _id: { $in: eventObjectIds }
        }).toArray();

        res.json(registeredEvents);

    } catch (err) {
        console.error("Fetching myevents error:", err);
        res.status(500).json({ message: "Error fetching user events", error: err.message });
    }
});

// GET /events route
app.get("/events", async (req, res) => {
  if (!eventsCollection) return res.status(500).json({ message: "MongoDB not connected yet" });
  try {
    const allEvents = await eventsCollection.find({}).toArray();
    res.json(allEvents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events", error: err });
  }
});