import { useState, useEffect } from "react";
import { usersAPI } from "../../services/api";
import { User, Mail, Calendar, Shield, Edit2, Save, X } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ email: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getProfile();
      setProfile(response.data.data);
      setFormData({ email: response.data.data.email });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setMessage("");
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({ email: profile.email });
    setMessage("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await usersAPI.updateProfile(formData);
      setProfile(response.data.data);
      setEditing(false);
      setMessage("Profil berhasil diperbarui!");
    } catch (error) {
      setMessage(error.response?.data?.error || "Gagal memperbarui profil");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Profil tidak ditemukan
        </h3>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Saya</h1>
        <p className="text-gray-600">Kelola informasi profil Anda</p>
      </div>

      <div className="card p-6">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("berhasil")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </label>
            {editing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Masukkan email baru"
              />
            ) : (
              <p className="text-gray-900">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Role
            </label>
            <div className="flex items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profile.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {profile.role === "admin" ? "Administrator" : "Pengguna"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Bergabung Sejak
            </label>
            <p className="text-gray-900">
              {new Date(profile.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex space-x-3 pt-6 border-t">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 btn-primary disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Menyimpan..." : "Simpan"}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 btn-secondary"
                >
                  <X className="h-4 w-4" />
                  <span>Batal</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 btn-primary"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit Profil</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
