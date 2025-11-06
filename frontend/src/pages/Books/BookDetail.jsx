import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { booksAPI, favoritesAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  Heart,
  User,
  Calendar,
  Edit,
  Trash2,
  BookOpen,
} from "lucide-react";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    fetchBookDetail();
  }, [id]);

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getById(id);
      setBook(response.data.data);

      if (user) {
        checkIfFavorite();
      }
    } catch (error) {
      console.error("Error fetching book:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const response = await favoritesAPI.getUserFavorites();
      const favorites = response.data.data;
      const isFav = favorites.some((fav) => fav.book_id === id);
      setIsFavorite(isFav);
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await favoritesAPI.remove(id);
        setIsFavorite(false);
      } else {
        await favoritesAPI.add(id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Favorite error:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      return;
    }

    try {
      await booksAPI.delete(id);
      navigate("/books");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Gagal menghapus buku");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Buku tidak ditemukan
        </h3>
        <Link to="/books" className="btn-primary mt-4 inline-block">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const canEdit =
    user && (user.role === "admin" || user.id === book.uploaded_by);

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/books"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Katalog
      </Link>

      <div className="card p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              {book.image_url ? (
                <img
                  src={`http://localhost:5000${book.image_url}`}
                  alt={book.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>Oleh: {book.uploaded_by_email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {new Date(book.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Deskripsi
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {book.description || "Tidak ada deskripsi."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-6 border-t">
              {user && (
                <button
                  onClick={handleFavorite}
                  disabled={favoriteLoading}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isFavorite
                      ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                  />
                  <span>{isFavorite ? "Favorit" : "Tambah Favorit"}</span>
                </button>
              )}

              {canEdit && (
                <>
                  <Link
                    to={`/upload?edit=${book.id}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <Edit className="h-5 w-5" />
                    <span>Edit</span>
                  </Link>

                  {user.role === "admin" && (
                    <button
                      onClick={handleDelete}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
