const User = require("../models/User");
const Favorite = require("../models/Favorite");

const userController = {
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
        },
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const { email } = req.body;
      const user_id = req.user.id;

      // Check if email already exists (excluding current user)
      if (email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser && existingUser.id !== user_id) {
          return res.status(400).json({
            success: false,
            error: "Email already exists",
          });
        }
      }

      const updatedUser = await User.update(user_id, { email });

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
          created_at: updatedUser.created_at,
        },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  async getUserFavorites(req, res) {
    try {
      const user_id = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const favorites = await Favorite.getByUserId(user_id, { page, limit });

      res.json({
        success: true,
        data: favorites,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: favorites.length,
        },
      });
    } catch (error) {
      console.error("Get user favorites error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
};

module.exports = userController;
