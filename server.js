const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Ensure data folder exists for offline / resilient fallback
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}
const localDbPath = path.join(dataDir, "registrations.json");
if (!fs.existsSync(localDbPath)) {
    fs.writeFileSync(localDbPath, JSON.stringify([], null, 2));
}

// 2027 Official Events Catalog
const EVENTS_CATALOG = [
    {
        id: "techspark-2027",
        name: "TechSpark 2027",
        category: "Technical",
        date: "15 February 2027",
        time: "09:30 AM - 04:30 PM",
        venue: "Seminar Hall, Jana Seva Sangh's Shri Ram College, Bhandup (W)",
        price: 250,
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200",
        description: "Annual flagship tech extravaganza featuring Hackathons, Web/App Development sprints, and Blind Coding challenges.",
        perks: "Certificate + Winner Cash Pool ₹10,000 + Refreshments"
    },
    {
        id: "ai-robotics-2027",
        name: "AI & Robotics Expo 2027",
        category: "Technical",
        date: "20 February 2027",
        time: "10:00 AM - 05:00 PM",
        venue: "Advanced Robotics Lab, Jana Seva Sangh's Shri Ram College, Bhandup (W)",
        price: 300,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
        description: "Hands-on Generative AI, Machine Learning demos, Drone racing, and Robo-Wars combat showcase.",
        perks: "Hands-on Kit + Certification + Project Mentorship"
    },
    {
        id: "tarang-cultural-2027",
        name: "Tarang Cultural Fest 2027",
        category: "Cultural",
        date: "26 February 2027",
        time: "04:00 PM - 09:30 PM",
        venue: "Main Campus Auditorium, Jana Seva Sangh's Shri Ram College, Bhandup (W)",
        price: 200,
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
        description: "An electrifying evening of Bollywood & Western Dance, Theatrical Drama, Solo/Duet Singing and Fashion Show.",
        perks: "Trophy + Official College Certificate + Stage Exposure"
    },
    {
        id: "sports-meet-2027",
        name: "Inter-College Sports Meet 2027",
        category: "Sports",
        date: "5 March 2027",
        time: "08:00 AM - 06:00 PM",
        venue: "College Sports Arena & Ground, Jana Seva Sangh's Shri Ram College, Bhandup (W)",
        price: 150,
        image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200",
        description: "Compete in Box Cricket, 5-a-side Rink Football, Badminton, Table Tennis, Chess, and Track Athletics.",
        perks: "Medals + Championship Trophy + Energy Drinks & Kits"
    },
    {
        id: "startup-summit-2027",
        name: "Startup & Entrepreneurship Summit 2027",
        category: "Business",
        date: "12 March 2027",
        time: "10:00 AM - 04:00 PM",
        venue: "Conference Hall, Jana Seva Sangh's Shri Ram College, Bhandup (W)",
        price: 200,
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200",
        description: "Pitch your startup ideas in front of angel investors and founder judges. Win seed funding opportunities.",
        perks: "Investor Pitch Desk + Incubation Access + Certificate"
    },
    {
        id: "esports-arena-2027",
        name: "Esports Battleground 2027",
        category: "Gaming",
        date: "18 March 2027",
        time: "11:00 AM - 06:30 PM",
        venue: "LAN Gaming Lounge, Jana Seva Sangh's Shri Ram College, Bhandup (W)",
        price: 200,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200",
        description: "Action-packed gaming tournament featuring BGMI Squad, Valorant 5v5, and FIFA 24 console showdown.",
        perks: "Gaming Gear + Cash Prize ₹8,000 + Winner Badges"
    },
    {
        id: "pixelcraft-photo-2027",
        name: "PixelCraft Photography & Film 2027",
        category: "Creative",
        date: "24 March 2027",
        time: "09:00 AM - 03:00 PM",
        venue: "College Courtyard, Jana Seva Sangh's Shri Ram College, Bhandup (W)",
        price: 100,
        image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200",
        description: "Capture the spirit of college life through theme-based street photography, portraiture, and 60-second reels.",
        perks: "Framed Exhibition of Winners + Lens Kit + Certificate"
    },
    {
        id: "creative-canvas-2027",
        name: "Poster & Art Competition 2027",
        category: "Creative",
        date: "2 April 2027",
        time: "10:30 AM - 02:30 PM",
        venue: "Art & Design Studio, Jana Seva Sangh's Shri Ram College, Bhandup (W)",
        price: 100,
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200",
        description: "Express your imagination on canvas through poster making, digital painting, rangoli, and comic sketching.",
        perks: "Art Supplies Kit + Merit Certificate + Exhibition"
    },
    {
        id: "cyber-bootcamp-2027",
        name: "Cyber Security & Ethical Hacking Bootcamp 2027",
        category: "Technical",
        date: "10 April 2027",
        time: "10:00 AM - 04:30 PM",
        venue: "Cyber Security Lab, Jana Seva Sangh's Shri Ram College, Bhandup (W)",
        price: 350,
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200",
        description: "Master network penetration testing, web vulnerabilities, CTF (Capture the Flag) puzzles, and bug hunting.",
        perks: "Cyber Kit + Certificate of Training + CTF Trophy"
    },
    {
        id: "voice-campus-2027",
        name: "Voice of Campus - Battle of Bands 2027",
        category: "Cultural",
        date: "18 April 2027",
        time: "04:30 PM - 09:00 PM",
        venue: "Open Air Amphitheatre, Jana Seva Sangh's Shri Ram College, Bhandup (W)",
        price: 150,
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200",
        description: "Live musical extravaganza showcasing collegiate bands, acoustic soloists, instrumentalists, and beatboxers.",
        perks: "Studio Recording Session + Trophy + Certificate"
    },
    {
        id: "mindquest-quiz-2027",
        name: "National MindQuest Quiz & Debate 2027",
        category: "Literary",
        date: "25 April 2027",
        time: "10:00 AM - 03:00 PM",
        venue: "Central Library Hall, Jana Seva Sangh's Shri Ram College, Bhandup (W)",
        price: 100,
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200",
        description: "Test your intellect across technology, current affairs, history, pop culture, and parliamentary debate rounds.",
        perks: "Book Hampers + Gold & Silver Medals + Certificate"
    },
    {
        id: "web3-cloud-2027",
        name: "Cloud & Web3 Masterclass 2027",
        category: "Technical",
        date: "2 May 2027",
        time: "10:00 AM - 04:00 PM",
        venue: "Tech Innovation Lab, Jana Seva Sangh's Shri Ram College, Bhandup (W)",
        price: 250,
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
        description: "Deploy scalable cloud applications on AWS and build smart contracts with decentralized applications.",
        perks: "Cloud Credits + Hands-on Project + Industry Certificate"
    }
];

// Helper to read local JSON data
function readLocalRegistrations() {
    try {
        if (!fs.existsSync(localDbPath)) return [];
        const content = fs.readFileSync(localDbPath, "utf-8");
        return JSON.parse(content || "[]");
    } catch (e) {
        console.error("Local DB read error:", e);
        return [];
    }
}

// Helper to write local JSON data
function writeLocalRegistrations(list) {
    try {
        fs.writeFileSync(localDbPath, JSON.stringify(list, null, 2), "utf-8");
    } catch (e) {
        console.error("Local DB write error:", e);
    }
}

// MongoDB Mongoose Schema
const registrationSchema = new mongoose.Schema({
    registrationId: { type: String, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    course: { type: String, required: true },
    events: [{
        id: String,
        name: String,
        price: Number,
        date: String
    }],
    totalAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, default: "Confirmed" },
    createdAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model("Registration", registrationSchema);

// MongoDB Connection with fallback flag
let isMongoConnected = false;
const MONGO_URI = process.env.MONGODB_URI || "mongodb://zeenat:zeenat743@ac-uf3syvq-shard-00-00.n12j1yc.mongodb.net:27017,ac-uf3syvq-shard-00-01.n12j1yc.mongodb.net:27017,ac-uf3syvq-shard-00-02.n12j1yc.mongodb.net:27017/?ssl=true&replicaSet=atlas-jzgqff-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
})
.then(() => {
    isMongoConnected = true;
    console.log("✅ MongoDB Connected successfully");
})
.catch((err) => {
    isMongoConnected = false;
    console.log("⚠️ MongoDB connection error (using local JSON database fallback):", err.message);
});

// Helper to generate a unique readable registration ID
function generateRegistrationId() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `CC-2027-${randomNum}`;
}

// Validation helpers
function validateRegistration(data) {
    const errors = {};

    // Full name
    if (!data.fullName || typeof data.fullName !== "string" || data.fullName.trim().length < 3) {
        errors.fullName = "Full Name must be at least 3 characters long.";
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!data.email || !emailRegex.test(data.email.trim())) {
        errors.email = "Invalid email address! Please enter a valid email like name@example.com";
    }

    // Phone number validation: strictly 10 digits
    const cleanedPhone = (data.phone || "").toString().replace(/[^0-9]/g, "");
    if (cleanedPhone.length !== 10) {
        errors.phone = `Invalid phone number! Must be exactly 10 digits (you entered ${cleanedPhone.length} digit${cleanedPhone.length === 1 ? '' : 's'}).`;
    } else if (!/^[6-9]/.test(cleanedPhone)) {
        errors.phone = "Invalid phone number! Indian mobile numbers must start with 6, 7, 8, or 9.";
    }

    // College
    if (!data.college || data.college.trim().length < 2) {
        errors.college = "College Name is required.";
    }

    // Course
    if (!data.course || data.course.trim().length < 2) {
        errors.course = "Course / Class is required (e.g. TY B.Sc CS).";
    }

    // Events check
    if (!data.events || !Array.isArray(data.events) || data.events.length === 0) {
        errors.events = "Please select at least one event to register.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// ================= API ROUTES =================

// 1. Get Events Catalog
app.get("/api/events", (req, res) => {
    res.json(EVENTS_CATALOG);
});

// 2. Register Student API
app.post("/register", async (req, res) => {
    console.log("POST /register received:", req.body.fullName, req.body.email);

    // Normalize events if single event string was sent
    let selectedEvents = [];
    if (Array.isArray(req.body.events)) {
        selectedEvents = req.body.events;
    } else if (req.body.event) {
        // legacy single event support
        const matched = EVENTS_CATALOG.find(e => e.name.toLowerCase() === req.body.event.toLowerCase());
        if (matched) {
            selectedEvents.push({
                id: matched.id,
                name: matched.name,
                price: matched.price,
                date: matched.date
            });
        } else {
            selectedEvents.push({
                id: "custom",
                name: req.body.event,
                price: 150,
                date: "2027"
            });
        }
    }

    // Deduplicate events to ensure no event is added or billed twice
    const uniqueEvents = [];
    const seenEvents = new Set();
    selectedEvents.forEach(ev => {
        const key = (ev.id || ev.name || "").toString().toLowerCase().trim();
        if (key && !seenEvents.has(key)) {
            seenEvents.add(key);
            uniqueEvents.push(ev);
        }
    });

    const payload = {
        fullName: req.body.fullName ? req.body.fullName.trim() : "",
        email: req.body.email ? req.body.email.trim().toLowerCase() : "",
        phone: req.body.phone ? req.body.phone.trim() : "",
        college: req.body.college ? req.body.college.trim() : "",
        course: req.body.course ? req.body.course.trim() : "",
        events: uniqueEvents
    };

    const validation = validateRegistration(payload);
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: "Validation failed! Please fix the errors highlighted below.",
            errors: validation.errors
        });
    }

    // Calculate billing without repetition
    let subtotal = 0;
    payload.events.forEach(ev => {
        subtotal += Number(ev.price) || 0;
    });

    // Multi-event discount: 10% discount if 2 or more events selected
    let discount = 0;
    if (payload.events.length >= 2) {
        discount = Math.round(subtotal * 0.10);
    }
    const totalAmount = subtotal - discount;

    const regDoc = {
        registrationId: generateRegistrationId(),
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        college: payload.college,
        course: payload.course,
        events: payload.events,
        subtotal: subtotal,
        discount: discount,
        totalAmount: totalAmount,
        paymentStatus: "Confirmed",
        createdAt: new Date().toISOString()
    };

    // Try saving to MongoDB if connected
    if (isMongoConnected) {
        try {
            const mongoRecord = new Registration(regDoc);
            await mongoRecord.save();
            console.log("Saved to MongoDB:", mongoRecord.registrationId);
        } catch (mErr) {
            console.warn("MongoDB save failed, saving to local JSON storage:", mErr.message);
        }
    }

    // Always keep local JSON updated as safety net
    const localList = readLocalRegistrations();
    localList.unshift(regDoc);
    writeLocalRegistrations(localList);

    return res.status(201).json({
        success: true,
        message: "Registration & Billing successfully completed!",
        registration: regDoc
    });
});

// 3. Get All Registrations (for Admin Dashboard)
app.get("/registrations", async (req, res) => {
    try {
        if (isMongoConnected) {
            try {
                const mongoData = await Registration.find().sort({ createdAt: -1 });
                if (mongoData && mongoData.length > 0) {
                    return res.json(mongoData);
                }
            } catch (err) {
                console.warn("MongoDB query failed, falling back to local file:", err.message);
            }
        }
        const localList = readLocalRegistrations();
        res.json(localList);
    } catch (error) {
        console.error("Get registrations error:", error);
        res.status(500).json({ error: "Failed to fetch registrations" });
    }
});

// 4. Delete Registration (Admin action)
app.delete("/registrations/:id", async (req, res) => {
    const id = req.params.id;
    try {
        if (isMongoConnected) {
            try {
                await Registration.deleteOne({
                    $or: [{ registrationId: id }, { _id: mongoose.isValidObjectId(id) ? id : null }]
                });
            } catch (e) {
                console.warn("Mongo delete error:", e.message);
            }
        }
        let localList = readLocalRegistrations();
        localList = localList.filter(item => item.registrationId !== id && item._id !== id);
        writeLocalRegistrations(localList);

        res.json({ success: true, message: "Registration removed successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
});

// 5. Statistics API (Base count is 425+, increases with every registration)
app.get("/stats", async (req, res) => {
    try {
        let allRegistrations = [];
        if (isMongoConnected) {
            try {
                allRegistrations = await Registration.find();
            } catch (e) {
                allRegistrations = readLocalRegistrations();
            }
        } else {
            allRegistrations = readLocalRegistrations();
        }

        const totalRegistrations = allRegistrations.length;
        const uniqueColleges = new Set(allRegistrations.map(r => (r.college || "").toLowerCase().trim()).filter(Boolean));
        
        let totalRevenue = 0;
        let totalEventsBooked = 0;
        const eventMap = {};

        allRegistrations.forEach(r => {
            totalRevenue += Number(r.totalAmount) || 0;
            if (Array.isArray(r.events)) {
                r.events.forEach(ev => {
                    totalEventsBooked++;
                    const evName = ev.name || ev;
                    eventMap[evName] = (eventMap[evName] || 0) + 1;
                });
            } else if (r.event) {
                totalEventsBooked++;
                eventMap[r.event] = (eventMap[r.event] || 0) + 1;
            }
        });

        // Base registration count is 425, dynamically incrementing with every new registration!
        const BASE_REGISTRATION_OFFSET = 425;
        const liveTotalCount = BASE_REGISTRATION_OFFSET + totalRegistrations;

        res.json({
            success: true,
            registrations: liveTotalCount,
            totalStudents: totalRegistrations,
            totalRevenue: totalRevenue,
            totalEventsBooked: totalEventsBooked,
            colleges: Math.max(12, uniqueColleges.size + 10),
            eventStats: eventMap
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ error: "Stats error" });
    }
});

// 6. Student Login & Registrations Lookup
app.post("/api/login/student", async (req, res) => {
    const { identifier } = req.body;
    if (!identifier || !identifier.trim()) {
        return res.status(400).json({ success: false, message: "Email or Phone Number is required." });
    }

    const cleanId = identifier.trim().toLowerCase();
    const cleanDigits = cleanId.replace(/[^0-9]/g, "");

    let records = [];
    if (isMongoConnected) {
        try {
            records = await Registration.find({
                $or: [
                    { email: cleanId },
                    { phone: cleanId },
                    { phone: cleanDigits }
                ]
            }).sort({ createdAt: -1 });
        } catch (e) {
            records = [];
        }
    }

    if (records.length === 0) {
        const localList = readLocalRegistrations();
        records = localList.filter(r => 
            (r.email && r.email.toLowerCase() === cleanId) || 
            (r.phone && r.phone.replace(/[^0-9]/g, "") === cleanDigits)
        );
    }

    if (records.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No registrations found for this email or phone number. Please register first!"
        });
    }

    return res.json({
        success: true,
        message: "Student login successful!",
        student: {
            fullName: records[0].fullName,
            email: records[0].email,
            phone: records[0].phone,
            college: records[0].college,
            course: records[0].course
        },
        registrations: records
    });
});

// 7. Admin Login API
app.post("/api/login/admin", (req, res) => {
    const { username, password } = req.body;
    if ((username === "admin" || username === "admin@shriramcollege.edu.in") && (password === "admin123" || password === "admin")) {
        return res.json({
            success: true,
            token: "admin-secure-token-2027",
            user: { username: "Administrator", role: "admin" }
        });
    }
    return res.status(401).json({
        success: false,
        message: "Invalid admin username or password! (Default: admin / admin123)"
    });
});

// Serve frontend SPA fallback
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 CampusConnect 2027 Server Running on:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`===============================================`);
});
