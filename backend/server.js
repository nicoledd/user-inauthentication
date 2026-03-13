const express = require("express");
const bcrypt = require("bcrypt");
const { Client } = require('pg');
const { hashPassword } = require('./utils/hash');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // needed for Supabase
});

client.connect()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('DB connection error', err));

const app = express();
app.use(express.json());

const cors = require("cors");

const allowedOrigins = ["https://user-inauthentication.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

// Apply CORS globally
app.use(cors(corsOptions));

// Catch-all route for unknown paths
app.all("/*", (req, res) => res.status(404).send("Not found"));

app.post('/signup', async(req, res) => {
  const { username, password } = req.body;
  if(!username || !password){
    return res.status(400).json({error: "Username and password are required"});
  }

  try {
    // check if username already exists
    const userCheck = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if(userCheck.rows.length > 0){
      return res.status(400).json({error: "Username already exists"});
    }

    // hash the password
    const hashed = await hashPassword(password);

    // insert new user
    await client.query(
      'INSERT INTO users(username, password_hash, password_plain) VALUES ($1, $2, $3)',
      [username, hashed, password]
    );
    return res.status(201).json({message: "User created successfully"});
  }
  catch(err){
    console.error(err);
    return res.status(500).json({error: "Internal server error"});
  }
});

app.post("/login", async(req, res) => {
  const {username, password} = req.body;
  if(!username || !password){
    return res.status(400).json({ success: false, error: "Username and password are required" });
  }
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if(result.rows.length === 0){
      const existingUsernamesResult = await client.query('SELECT username FROM users LIMIT 5');
      return res.status(401).json({ success: false, error: "USERNAME_NOT_FOUND", username: existingUsernamesResult.rows.map(row => row.username) });
    }
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if(!passwordMatch){
      return res.status(401).json({ success: false, error: "INCORRECT_PASSWORD", password: user.password_plain });
    }
    return res.status(200).json({ success: true, message: "Login successful" }); 
  }
  catch(err){
    console.error(err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await client.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.send("<h1>Backend is running!</h1>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});