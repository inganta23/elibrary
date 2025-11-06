import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BookOpen } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Minimal 8 karakter");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Harus mengandung huruf kecil");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Harus mengandung huruf besar");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Harus mengandung angka");
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });


    if (name === "password") {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    const passwordValidationErrors = validatePassword(formData.password);
    if (passwordValidationErrors.length > 0) {
      setError("Password tidak memenuhi requirements");
      setLoading(false);
      return;
    }

    const result = await register({
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const isPasswordValid =
    passwordErrors.length === 0 && formData.password.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <BookOpen className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Daftar Akun Baru
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Atau{" "}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            masuk ke akun yang sudah ada
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field ${
                    formData.password
                      ? isPasswordValid
                        ? "border-green-300"
                        : "border-red-300"
                      : ""
                  }`}
                  placeholder="Masukkan password"
                />
              </div>

              {formData.password && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Requirements:
                  </p>
                  <ul className="text-xs space-y-1">
                    <li
                      className={`flex items-center ${
                        formData.password.length >= 8
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <span className="mr-1">•</span>
                      Minimal 8 karakter
                    </li>
                    <li
                      className={`flex items-center ${
                        /(?=.*[a-z])/.test(formData.password)
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <span className="mr-1">•</span>
                      Huruf kecil (a-z)
                    </li>
                    <li
                      className={`flex items-center ${
                        /(?=.*[A-Z])/.test(formData.password)
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <span className="mr-1">•</span>
                      Huruf besar (A-Z)
                    </li>
                    <li
                      className={`flex items-center ${
                        /(?=.*\d)/.test(formData.password)
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <span className="mr-1">•</span>
                      Angka (0-9)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Konfirmasi Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-field ${
                    formData.confirmPassword
                      ? formData.password === formData.confirmPassword
                        ? "border-green-300"
                        : "border-red-300"
                      : ""
                  }`}
                  placeholder="Konfirmasi password"
                />
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    Password tidak cocok
                  </p>
                )}
            </div>

            <div>
              <button
                type="submit"
                disabled={
                  loading ||
                  !isPasswordValid ||
                  formData.password !== formData.confirmPassword
                }
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Mendaftarkan..." : "Daftar"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
