import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../../components/books/BookCard";
import { booksAPI } from "../../services/api";
import { Search, Filter } from "lucide-react";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    fetchBooks();
  }, [searchParams]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const search = searchParams.get("search");
      const params = search ? { q: search } : {};

      const response = await booksAPI.getAll(params);
      setBooks(response.data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white/50 backdrop-blur-sm z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {searchParams.get("search")
            ? `Hasil pencarian: "${searchParams.get("search")}"`
            : "Katalog Buku"}
        </h1>

        <form onSubmit={handleSearch} className="max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari buku berdasarkan judul atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </form>
      </div>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onFavoriteUpdate={fetchBooks} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Tidak ada buku
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchParams.get("search")
              ? "Tidak ada buku yang sesuai dengan pencarian Anda."
              : "Belum ada buku yang diupload."}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookList;
