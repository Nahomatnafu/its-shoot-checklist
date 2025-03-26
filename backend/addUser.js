const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Define Users
    const users = [
      {
        name: "Fabio Castel Garcia",
        email: "fabio.castelgarcia.2@mnsu.edu",
        password: "password0000",
        role: "admin",
        position: "Visual Production Director",
      },
      {
        name: "Nahom Atnafu",
        email: "nahom.atnafu@mnsu.edu",
        password: "password0000",
        role: "admin",
        position: "student",
      },
      {
        name: "Kathryn Petzel",
        email: "kathryn.petzel@mnsu.edu",
        password: "password0000",
        role: "admin",
        position: "student",
      },
      {
        name: "Amy Linde",
        email: "amy.linde@mnsu.edu",
        password: "password0000",
        role: "admin",
        position: "Communication and Media Director",
      },
      {
        name: "Isabelle Linden",
        email: "isabelle.linden@mnsu.edu",
        password: "password0000",
        role: "admin",
        position: "student",
      },
      {
        name: "Derick Franklin",
        email: "derick.franklin@mnsu.edu",
        password: "password0000",
        role: "student",
        position: "student",
      },
      {
        name: "Omar Elkenawy",
        email: "omar.elkenawy@mnsu.edu",
        password: "password0000",
        role: "student",
        position: "student",
      },
      {
        name: "Connor Kulas",
        email: "connor.kulas@mnsu.edu",
        password: "password0000",
        role: "student",
        position: "student",
      },
      {
        name: "Lilly Anderson",
        email: "lilly.anderson@mnsu.edu",
        password: "password0000",
        role: "student",
        position: "student",
      },
      {
        name: "Rajesh Karki",
        email: "rajesh.karki@mnsu.edu",
        password: "password0000",
        role: "student",
        position: "student",
      },
    ];

    // Hash passwords before inserting users
    for (let user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    // Insert users into database
    await User.insertMany(users);
    console.log("✅ Users added successfully");

    mongoose.connection.close(); // Close DB connection
  })
  .catch((err) => console.log("❌ MongoDB Connection Failed:", err));
