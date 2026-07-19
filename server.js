const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Schema
const registrationSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    college: String,
    course: String,
    event: String
});

const Registration = mongoose.model("Registration", registrationSchema);

// MongoDB Connection
mongoose.connect(
    "mongodb://zeenat:zeenat743@ac-uf3syvq-shard-00-00.n12j1yc.mongodb.net:27017,ac-uf3syvq-shard-00-01.n12j1yc.mongodb.net:27017,ac-uf3syvq-shard-00-02.n12j1yc.mongodb.net:27017/?ssl=true&replicaSet=atlas-jzgqff-shard-0&authSource=admin&appName=Cluster0"
)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((error) => {
    console.log("MongoDB Error:", error);
});

// Test Route
app.get("/register", (req, res) => {
    res.send("Register route working");
});

// Registration API
app.post("/register", async (req, res) => {

    console.log("REGISTER API HIT");

    try {

        const registration = new Registration(req.body);

        await registration.save();

        console.log("Data Saved:", registration);

        res.json({
            message: "Registration successful!"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Database Error"
        });

    }

});

// Get All Registrations
app.get("/registrations", async (req, res) => {

    try {

        const registrations = await Registration.find();

        res.json(registrations);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Database Error"
        });

    }

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
