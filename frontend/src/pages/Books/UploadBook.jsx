import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { booksAPI } from "../../services/api";
import { Upload, Image, Save, ArrowLeft } from "lucide-react";

const UploadBook = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    if (editId) {
      fetchBookData();
    }
  }, [editId]);

  const fetchBookData = async () => {
    try {
      const response = await booksAPI.getById(editId);
      const book = response.data.data;
      setFormData({
        title: book.title,
        description: book.description,
      });
      if (book.image_url) {
        setPreview(`http://localhost:5000${book.image_url}`);
      }
    } catch (error) {
      console.error("Error fetching book:", error);
      setMessage({ type: "error", text: "Gagal memuat data buku" });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setMessage({ type: "error", text: "Judul buku wajib diisi" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      if (editId) {
        await booksAPI.update(editId, submitData);
        setMessage({ type: "success", text: "Buku berhasil diperbarui!" });
      } else {
        await booksAPI.create(submitData);
        setMessage({ type: "success", text: "Buku berhasil diupload!" });
        setFormData({ title: "", description: "", image: null });
        setPreview("");
      }

      const fileInput = document.getElementById("image");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error uploading book:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Upload className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            {editId ? "Edit Buku" : "Upload Buku Baru"}
          </h1>
        </div>
        <p className="text-gray-600">
          {editId
            ? "Perbarui informasi buku"
            : "Tambahkan buku baru ke koleksi perpustakaan"}
        </p>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali
      </button>

      <div className="card p-6">
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Judul Buku *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Masukkan judul buku"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input-field resize-none"
              placeholder="Masukkan deskripsi buku (opsional)"
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Gambar Buku {!editId && "(Opsional)"}
            </label>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Image className="mx-auto h-12 w-12" />
                      <span className="text-sm mt-2 block">Preview</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  <Upload className="h-4 w-4" />
                  <span>Pilih Gambar</span>
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Format: JPG, PNG, GIF (Maks. 5MB)
                </p>
                {formData.image && (
                  <p className="text-sm text-green-600 mt-1">
                    File dipilih: {formData.image.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 btn-primary disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>
                {loading
                  ? "Memproses..."
                  : editId
                  ? "Perbarui Buku"
                  : "Upload Buku"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadBook;
