import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BookCard from "../../components/books/BookCard";
import { favoritesAPI } from "../../services/api";
import { Heart } from "lucide-react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesAPI.getUserFavorites();
      const transformedFavorites = response.data.data.map((fav) => ({
        ...fav,
        id: fav.book_id,
        is_favorite: true,
      }));
      setFavorites(transformedFavorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteUpdate = () => {
    fetchFavorites();
  };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center space-x-3 mb-4">
//           <Heart className="h-8 w-8 text-red-500" />
//           <h1 className="text-3xl font-bold text-gray-900">
//             Buku Favorit Saya
//           </h1>
//         </div>
//         <p className="text-gray-600">Kelola koleksi buku favorit Anda</p>
//       </div>

//       {favorites.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {favorites.map((book) => (
//             <BookCard
//               key={book.id}
//               book={book}
//               onFavoriteUpdate={handleFavoriteUpdate}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-12">
//           <Heart className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">
//             Belum ada buku favorit
//           </h3>
//           <p className="mt-1 text-sm text-gray-500">
//             Mulai tambahkan buku ke favorit Anda dari katalog.
//           </p>
//           <Link to="/books" className="btn-primary mt-4 inline-block">
//             Jelajahi Katalog
//           </Link>
//         </div>
//       )}
//     </div>
//   );

return (
    <div className="relative min-h-screen">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/50 backdrop-blur-sm z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}
  
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-900">Buku Favorit Saya</h1>
        </div>
        <p className="text-gray-600">Kelola koleksi buku favorit Anda</p>
      </div>
  
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((book) => (
            <BookCard key={book.id} book={book} onFavoriteUpdate={handleFavoriteUpdate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Belum ada buku favorit
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Mulai tambahkan buku ke favorit Anda dari katalog.
          </p>
          <Link to="/books" className="btn-primary mt-4 inline-block">
            Jelajahi Katalog
          </Link>
        </div>
      )}
    </div>
  );
  
};

export default Favorites;
