const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public1")); // Serve static files from both 'public' and 'public1'
app.use(cors());

// MongoDB Connection
(async () => {
    try {
        // Use environment variable for MongoDB URI or fallback to hardcoded string
        const mongoURI = process.env.MONGODB_URL || 'mongodb+srv://anmol:Anmol%40123@form-data.hqr1p.mongodb.net/myDatabase?retryWrites=true&w=majority';
        
        // Connect to MongoDB Atlas using async/await
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error.message);
        process.exit(1); // Exit the process with failure
    }
})();

// Define schemas and models
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema, 'users');

// Route for handling sign-ups
app.post("/sign_up", async (req, res) => {
    try {
        const { name, email, phone, Date_Of_Birth, Time_Of_Birth, birth_place, price, birth_pincode, gender } = req.body;

        // Prepare the data object
        const data = {
            name,
            email,
            phone,
            Date_Of_Birth,
            Time_Of_Birth,
            birth_place,
            price,
            birth_pincode,
            gender,
        };

        // Insert data into the 'details' collection
        await mongoose.connection.collection("details").insertOne(data);
        console.log("Record inserted successfully");

        // Redirect or respond with a success message
        res.status(201).send("Signup successful");
    } catch (error) {
        console.error("Error inserting data:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Authentication Endpoint
app.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    console.log('Received email:', email);
    console.log('Received password:', password);

    try {
        // Check if the user exists in the 'users' collection
        const user = await User.findOne({ email, password });
        
        if (user) {
            console.log("User found:", user);
            res.json({ success: true });
        } else {
            console.log("User not found or incorrect password");
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
// Root route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public1/course.html'); // Ensure course.html is in the 'public1' directory
});

// Fallback route for sign-up service info
app.get("/info", (req, res) => {
    res.set({ "Access-Control-Allow-Origin": "*" });
    res.send("Welcome to the sign-up and authentication service");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
