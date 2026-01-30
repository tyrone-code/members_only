// models/user.js
const pool = require("./db"); // wherever your pool is

const User = {
  async findByEmail(email) {
    const result = await pool.query(
      "SELECT * FROM signed_up WHERE email = $1",
      [email],
    );
    return result.rows[0];
  },

  async create({ username, email, password }) {
    const result = await pool.query(
      `INSERT INTO signed_up (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, password],
    );
    return result.rows[0];
  },
};

module.exports = User;
