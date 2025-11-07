const db = require("../config/database");

class TokenBlacklist {
  static async add(token, expiresAt) {
    await db.query(
      "INSERT INTO token_blacklist (token, expires_at) VALUES ($1, $2)",
      [token, expiresAt]
    );
  }

  static async isBlacklisted(token) {
    const result = await db.query(
      "SELECT 1 FROM token_blacklist WHERE token = $1 AND expires_at > NOW()",
      [token]
    );
    return result.rows.length > 0;
  }

  static async cleanup() {
    await db.query("DELETE FROM token_blacklist WHERE expires_at < NOW()");
  }
}

module.exports = TokenBlacklist;
