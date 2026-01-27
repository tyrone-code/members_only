// models/user.js
const pool = require("./db");

const User = {
  create: async (name, email) => {
    const query = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";
    const values = [name, email];

    try {
      const res = await pool.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("DB Error:", err);
      throw new Error("Database error while creating user");
    }
  },
};

module.exports = User;
