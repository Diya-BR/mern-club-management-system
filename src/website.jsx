import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; 

let LinkData = createContext();//shares data with components without using props everytime 
const API_BASE_URL = 'http://localhost:5001';

// --- Login Component ---
function Login() {
  const { user, setUser } = useContext(LinkData); //deconstructing the return values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user); 
        // Persist user data to local storage for session management after reload
        localStorage.setItem('currentUser', JSON.stringify(data.user)); 
        
        alert('Login successful! Redirecting to home...');
        // Force a full page redirect/reload
        window.location.replace('/'); 
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', marginBottom: '10px', padding: '8px' }} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', marginBottom: '10px', padding: '8px' }} 
        />
        <button 
          type="submit" 
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <p>Don't have an account? <Link to="/signup" style={{ color: '#2196F3', textDecoration: 'none' }}>Sign Up</Link></p>
    </div>
  );
}

// --- SignUp Component ---
function SignUp() {
  const [formData, setFormData] = useState({
    name: '', gender: '', email: '', phoneNumber: '', password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Sign Up successful! Redirecting to login...');
        setTimeout(() => window.location.replace('/login'), 2000); 
      } else {
        setError(data.message || 'Sign up failed');
      }
    } catch (err) {
      setError('An error occurred during sign up. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({ name: '', gender: '', email: '', phoneNumber: '', password: '' });
    setError('');
    setSuccess('');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSignUp}>
        <label htmlFor="name">Name :</label> &nbsp;
        <input type="text" placeholder="Name" id="name" name="name" value={formData.name} onChange={handleChange} required style={{ display: 'block', marginBottom: '10px', padding: '8px' }} />
        
        <div style={{ marginBottom: '10px' }}>
          <input type="radio" value="Male" id="male" name="gender" onChange={handleChange} checked={formData.gender === 'Male'} required />
          <label htmlFor="male">Male</label> &nbsp;
          <input type="radio" value="Female" id="female" name="gender" onChange={handleChange} checked={formData.gender === 'Female'} />
          <label htmlFor="female">Female</label> &nbsp;
          <input type="radio" value="Other" id="other" name="gender" onChange={handleChange} checked={formData.gender === 'Other'} />
          <label htmlFor="other">Other</label> &nbsp;
        </div>
        
        <label htmlFor="email">Email :</label> &nbsp;
        <input type="email" placeholder="Email" id="email" name="email" value={formData.email} onChange={handleChange} required style={{ display: 'block', marginBottom: '10px', padding: '8px' }} />
        
        <label htmlFor="phoneNumber">Phone Number :</label> &nbsp;
        <input type="tel" placeholder="Telephone" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required style={{ display: 'block', marginBottom: '10px', padding: '8px' }} />
        
        <label htmlFor="password">Password :</label> &nbsp;
        <input type="password" placeholder="Password" id="password" name="password" value={formData.password} onChange={handleChange} required style={{ display: 'block', marginBottom: '10px', padding: '8px' }} />
        
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sign Up</button>&nbsp;&nbsp;
        <button type="button" onClick={handleReset} style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reset</button>
      </form>
      <p>Already have an account? <Link to="/login" style={{ color: '#2196F3', textDecoration: 'none' }}>Login</Link></p>
    </div>
  );
}

function MyEvents() {
  let { user } = useContext(LinkData); 
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      fetch(`${API_BASE_URL}/myevents/${user._id}`) 
        .then(res => res.json())
        .then(data => {
          setMyEvents(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching user events:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setMyEvents([]);
    }
  }, [user]);

  if (!user)
    return (
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
        <p>
          Please <Link to="/login" style={{ padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}>Login</Link> to view MyEvents.
        </p>
      </div>
    );
  
  if (loading) return <p>Loading your registered events...</p>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h2>MyEvents - Welcome, {user.name || user.email}</h2>
      
      {myEvents.length === 0 ? (
          <p>You haven't registered for any events yet. Check out the <Link to="/events">Events page</Link>!</p>
      ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {myEvents.map(event => (
              <div
                key={event.id || event._id}
                style={{
                  border: "1px solid #4CAF50", 
                  borderRadius: "8px",
                  width: "300px",
                  backgroundColor: "#e8f5e9",
                  overflow: "hidden",
                  padding: "15px",
                }}
              >
                <h3>{event.name}</h3>
                <p><strong>Club:</strong> {event.club}</p>
                <p><strong>Date:</strong> {event.date} at {event.time}</p>
              </div>
            ))}
          </div>
      )}
    </div>
  );
}

// --- Events Component ---
function Events() {
  const { user } = useContext(LinkData); 
  const [events, setEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch all events and user's registrations
  const fetchEventData = async () => {
    setLoading(true);
    try {
      // 1. Fetch All Events
      const eventsResponse = await fetch(`${API_BASE_URL}/events`);
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);

      // 2. Fetch User's Registered Event IDs (if logged in)
      if (user && user._id) {
        const registrationsResponse = await fetch(`${API_BASE_URL}/myevents-ids/${user._id}`);
        if (registrationsResponse.ok) {
            const registrationsData = await registrationsResponse.json();
            setRegisteredEventIds(registrationsData); 
        }
      } else {
        setRegisteredEventIds([]);
      }
    } catch (err) {
      console.error("Error fetching event data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [user]); // Re-run when the user logs in or out

  const handleRegister = async (eventId, eventName) => {
    if (!user) {
      alert("Please log in to register for an event.");
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/register-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, eventId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Successfully registered for: ${eventName}!`);
        // Immediately update the local state to change the button appearance
        setRegisteredEventIds(prevIds => [...prevIds, eventId]); 
      } else {
        alert(data.message || `Registration failed for ${eventName}.`);
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert('An error occurred during registration.');
    }
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <h2>Events</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {events.map(event => {
            const eventIdString = event._id || event.id;
            const isRegistered = registeredEventIds.includes(eventIdString);

            return (
              <div
                key={eventIdString}
                style={{
                  border: `1px solid ${isRegistered ? '#FFC107' : '#ccc'}`,
                  borderRadius: "8px",
                  width: "300px",
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <img
                  src={event.image}
                  alt={event.name}
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                />
                <div style={{ padding: "15px", flex: 1 }}>
                  <h3>{event.name}</h3>
                  <p><strong>Club:</strong> {event.club}</p>
                  <p><strong>Date:</strong> {event.date}</p>
                  <p style={{ marginTop: "10px" }}>{event.description}</p>
                </div>
                <div style={{ padding: "10px" }}>
                  {event.ended ? (
                    <button
                      disabled
                      style={{
                        width: "100%", padding: "10px", backgroundColor: "#ccc", color: "#666", border: "none", borderRadius: "4px", cursor: "not-allowed",
                      }}
                    >
                      Event Ended
                    </button>
                  ) : isRegistered ? (
                    <button
                      disabled
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#FFC107", // Yellow background
                        color: "black",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "default",
                        fontWeight: 'bold',
                      }}
                    >
                      ✅ Registered
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(eventIdString, event.name)} 
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: user ? "#4CAF50" : "#9E9E9E",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: user ? "pointer" : "not-allowed",
                      }}
                      disabled={!user} 
                    >
                      {user ? "Register" : "Login to Register"}
                    </button>
                  )}
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
}

// --- Other Components ---
function Home() {
  return (
    <div
      style={{padding: "40px 20px",justifyContent: "center",textAlign: "center",background: 'linear-gradient(120deg, #a8edea 0%, #fed6e3 100%)', minHeight: '100vh'}}>
      <h1 style={{color: "#00796b",marginBottom: "20px",fontWeight: "bold"}}>
         <strong>College Club Management Portal</strong>
      </h1>

      <p style={{color: "#555",textAlign: "center"}}>
        Welcome to your all-in-one college activity portal! Discover upcoming events,
         register effortlessly, and stay connected with your campus community.
      </p>

      <div>
        <Link
          to="/events"
          style={{
            padding: "12px 24px",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            marginRight: "12px",
          }}
        >
          Browse Events
        </Link>

        <Link
          to="/About"
          style={{
            padding: "12px 24px",
            backgroundColor: "#2196F3",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Learn More About the Portal
        </Link>
      </div>
    </div>
  );
}


function About() {
  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        padding: "60px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h1
        style={{color: "#769",marginBottom: "20px"}}>
          <strong><bold> About This Portal</bold></strong>
      </h1>

      <p
  style={{
    color: "#555",textAlign: "center",padding: "20px",
    marginLeft: "100px", marginRight: "100px",fontSize: "18px", }}
>
  Our <strong>Club Management Portal</strong> is a web-based application designed
  to make managing and participating in club events easy and efficient.
  It provides students and club members with a simple interface to explore
   upcoming events, register for them, and keep track of their personal 
   event list — all in one place.
</p>

<div
  style={{fontSize: "17px",marginTop: "20px"}}>
  <strong>Features available:</strong>
  <ul>
    <li> User authentication</li>
    <li>Display the Events</li>
    <li>View Registered Events</li>
  </ul>
    
</div>
<p style={{fontSize:"14px"}}> This project is built using React, Node.js, Express, and MongoDB </p>
    </div>
  );
}
function EventDetails({ id }) {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h3>Event Details for Event ID: {id}</h3>
    </div>
  );
}
function Event1() { return <EventDetails id="e1" />; }
function Event2() { return <EventDetails id="e2" />; }

// --- App Component (Container) ---
function App() {
  let [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const logout = () => {
      setUser(null);
      localStorage.removeItem('currentUser');
      window.location.replace('/'); 
  };
  
  const displayName = user ? (user.name || user.email) : 'Guest'; 
  
  return (
    <div>
      <LinkData.Provider value={{ user, setUser, logout }}>
        <BrowserRouter>
          <nav style={{ backgroundColor: '#333', padding: '10px', display: 'flex', alignItems: 'center', width: '100%' }}>
            <Link to="/" style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}>
              Home
            </Link>
            <Link to="/events" style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}>
              Events
            </Link>
            <Link to="/MyEvents" style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}>
              MyEvents
            </Link>
            <Link to="/About" style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#9C27B0', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none' }}>
              About
            </Link>
            {user ? (
              <>
                <span style={{ color: 'white', marginRight: '10px', marginLeft: 'auto' }}>Welcome, {displayName}</span>
                <button onClick={logout} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '20px' }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/signup" style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#FFC107', color: 'black', border: 'none', borderRadius: '4px', textDecoration: 'none', marginLeft: 'auto' }}>Sign Up</Link>
                <Link to="/login" style={{ padding: '10px 20px', marginRight: '20px', backgroundColor: '#FFFFFF', color: 'black', border: 'none', borderRadius: '4px', textDecoration: 'none' }}>Login</Link>
              </>
            )}
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/MyEvents" element={<MyEvents />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/event1" element={<Event1 />} />
            <Route path="/events/event2" element={<Event2 />} />
            <Route path="/About" element={<About />} />
          </Routes>
        </BrowserRouter>
      </LinkData.Provider>
    </div>
  );
}

export default App;