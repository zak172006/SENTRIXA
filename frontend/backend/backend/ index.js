
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "http://localhost:5500",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10kb" }));

const DATA_FILE = path.join(__dirname, "users.json");
const sessions = new Map();

function loadUsers() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, "[]");
    }

    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveUsers(users) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return { salt, hash };
}

function verifyPassword(password, salt, storedHash) {
    const calculated = crypto.scryptSync(password, salt, 64);
    const original = Buffer.from(storedHash, "hex");

    return original.length === calculated.length &&
        crypto.timingSafeEqual(calculated, original);
}

function createToken() {
    return crypto.randomBytes(32).toString("hex");
}

function authenticate(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ")
        ? header.slice(7)
        : "";

    const session = sessions.get(token);

    if (!session) {
        return res.status(401).json({
            success: false,
            message: "Please login first"
        });
    }

    req.userId = session.userId;
    next();
}

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "SENTRIXA API is running",
        version: "1.0.0"
    });
});

// Register
app.post("/api/auth/register", (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid input"
            });
        }

        if (name.trim().length < 2 || name.length > 80) {
            return res.status(400).json({
                success: false,
                message: "Name must contain 2 to 80 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address"
            });
        }

        if (password.length < 10 || password.length > 128) {
            return res.status(400).json({
                success: false,
                message: "Password must be 10 to 128 characters"
            });
        }

        const users = loadUsers();

        if (users.some(user => user.email === normalizedEmail)) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const passwordData = hashPassword(password);

        const user = {
            id: crypto.randomUUID(),
            name: name.trim(),
            email: normalizedEmail,
            passwordHash: passwordData.hash,
            salt: passwordData.salt,
            createdAt: new Date().toISOString()
        };

        users.push(user);
        saveUsers(users);

        res.status(201).json({
            success: true,
            message: "Account created successfully"
        });

    } catch (error) {
        console.error("Register error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Login
app.post("/api/auth/login", (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" ||
            typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const users = loadUsers();

        const user = users.find(item => item.email === normalizedEmail);

        if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = createToken();

        sessions.set(token, {
            userId: user.id,
            expiresAt: Date.now() + (60 * 60 * 1000)
        });

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Current user
app.get("/api/auth/me", authenticate, (req, res) => {
    const users = loadUsers();
    const user = users.find(item => item.id === req.userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.json({
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

// Logout
app.post("/api/auth/logout", authenticate, (req, res) => {
    const token = req.headers.authorization.slice(7);
    sessions.delete(token);

    res.json({
        success: true,
        message: "Logged out successfully"
    });
});

app.listen(PORT, () => {
    console.log(`SENTRIXA API running at http://localhost:${PORT}`);
});
