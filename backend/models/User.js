const db = require("../config/database");

class User {
  static async findByEmail(email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      "SELECT id, email, role, created_at FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  static async create(email, password, role = "user") {
    const result = await db.query(
      `INSERT INTO users (email, password, role) 
       VALUES ($1, $2, $3) 
       RETURNING id, email, role, created_at`,
      [email, password, role]
    );
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);

    const result = await db.query(
      `UPDATE users 
       SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount} 
       RETURNING id, email, role, created_at`,
      values
    );

    return result.rows[0];
  }
}

module.exports = User;
