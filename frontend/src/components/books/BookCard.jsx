import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, User } from "lucide-react";
import { favoritesAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const BookCard = ({ book, onFavoriteUpdate }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(book.is_favorite);
  const [loading, setLoading] = useState(false);

  const handleFavorite = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (isFavorite) {
        await favoritesAPI.remove(book.id);
        setIsFavorite(false);
      } else {
        await favoritesAPI.add(book.id);
        setIsFavorite(true);
      }
      onFavoriteUpdate?.();
    } catch (error) {
      console.error("Favorite error:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const response = await favoritesAPI.getUserFavorites();
      const favorites = response.data.data;
      const isFav = favorites.some((fav) => fav.book_id === book.id);
      setIsFavorite(isFav);
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
  }, [user, book.id]);

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col h-full">

        <div className="aspect-w-3 aspect-h-4 mb-4 bg-gray-200 rounded-lg overflow-hidden">
          {book.image_url ? (
            <img
              src={`http://localhost:5000${book.image_url}`}
              alt={book.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {book.title}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {book.description}
          </p>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <User className="h-4 w-4 mr-1" />
            <span>{book.uploaded_by_email}</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <Link
            to={`/books/${book.id}`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Lihat Detail
          </Link>

          {user && (
            <button
              onClick={handleFavorite}
              disabled={loading}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isFavorite
                  ? "text-red-500 bg-red-50 hover:bg-red-100"
                  : "text-gray-400 hover:text-red-500 hover:bg-gray-100"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
