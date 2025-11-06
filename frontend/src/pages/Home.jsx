import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { booksAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { BookOpen, Users, Upload, ArrowRight, TrendingUp } from "lucide-react";
import BookCard from "../components/books/BookCard";

const Home = () => {
  const { user } = useAuth();
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBooks();
  }, []);

  const fetchRecentBooks = async () => {
    try {
      const response = await booksAPI.getAll({ limit: 4 });
      setRecentBooks(response.data.data);
    } catch (error) {
      console.error("Error fetching recent books:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: BookOpen,
      label: "Total Buku",
      value: recentBooks.length,
      color: "blue",
    },
    { icon: Users, label: "Pengguna", value: "100+", color: "green" },
    { icon: TrendingUp, label: "Aktif", value: "24/7", color: "purple" },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl text-white">
        <div className="max-w-4xl mx-auto px-4">
          <BookOpen className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Selamat Datang di E-Library
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Temukan dan kelola koleksi buku digital Anda di satu tempat
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/books"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Jelajahi Katalog
            </Link>
            {user && user.role === "admin" && (
              <Link
                to="/upload"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Upload Buku
              </Link>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6 text-center">
              <stat.icon
                className={`mx-auto h-8 w-8 text-${stat.color}-600 mb-3`}
              />
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Buku Terbaru
            </h2>
            <p className="text-gray-600">
              Jelajahi koleksi buku terbaru yang tersedia
            </p>
          </div>
          <Link
            to="/books"
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="card p-6 animate-pulse">
                <div className="h-48 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : recentBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Belum ada buku
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Mulai upload buku pertama Anda.
            </p>
            {user?.role === "admin" && (
              <Link to="/upload" className="btn-primary mt-4 inline-block">
                Upload Buku
              </Link>
            )}
          </div>
        )}
      </section>

      {/* <section className="bg-gray-50 rounded-2xl p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Mengapa Memilih E-Library?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <BookOpen className="mx-auto h-8 w-8 text-primary-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Koleksi Lengkap
              </h3>
              <p className="text-gray-600 text-sm">
                Akses ribuan buku digital dari berbagai genre dan kategori
              </p>
            </div>
            <div className="text-center">
              <Users className="mx-auto h-8 w-8 text-primary-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Komunitas Aktif
              </h3>
              <p className="text-gray-600 text-sm">
                Bergabung dengan komunitas pembaca dan berbagi pengalaman
              </p>
            </div>
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-primary-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Upload Mudah</h3>
              <p className="text-gray-600 text-sm">
                Tambahkan buku Anda sendiri dengan proses yang sederhana
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
