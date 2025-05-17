import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaGlobe,
  FaSave,
  FaBell,
  FaFingerprint,
  FaEdit,
  FaTimes,
  FaShieldAlt,
} from "react-icons/fa";

export default function UserProfilePage({ accountId }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    language: "en",
    notification_preferences: {
      email: true,
      push: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/members/by-id/${accountId}`);
        if (res.ok) {
          const existing = await res.json();
          setForm({
            name: existing.name || "",
            email: existing.email || "",
            language: existing.language || "en",
            notification_preferences: {
              email: existing.notification_preferences?.email ?? true,
              push: existing.notification_preferences?.push ?? false,
            },
          });
        }
      } catch (err) {
        console.error("Fehler beim Laden des Profils:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accountId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("notification_preferences")) {
      setForm((prev) => ({
        ...prev,
        notification_preferences: {
          ...prev.notification_preferences,
          [name.split(".")[1]]: checked,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

    const response = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_id: accountId,
        ...form,
      }),
    });

    if (response.ok) {
      alert("✅ Profil gespeichert!");
      setIsEditing(false);
    } else {
      const err = await response.json();
      alert("❌ Fehler: " + err.error);
    }
  };

  if (loading) return <div className="p-6">Lade Profil...</div>;

  return (
    <div className="min-h-screen bg-pattern text-black px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="glass-effect p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#2c1c5b] flex items-center gap-3">
              <FaUser className="text-[#6B46C1]" />
              Profil
            </h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="modern-button"
              >
                <FaEdit /> Bearbeiten
              </button>
            )}
          </div>
          <p className="text-gray-600">
            Verwalte deine persönlichen Informationen und Einstellungen
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Info */}
          <div className="glass-effect p-6">
            <h2 className="text-xl font-semibold text-[#2c1c5b] mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-[#6B46C1]" />
              Account Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaFingerprint className="text-[#6B46C1]" />
                  NEAR Account ID
                </label>
                <input
                  type="text"
                  value={accountId}
                  disabled
                  className="w-full p-3 bg-white/80 rounded-lg border border-gray-200 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="glass-effect p-6">
            <h2 className="text-xl font-semibold text-[#2c1c5b] mb-4 flex items-center gap-2">
              <FaUser className="text-[#6B46C1]" />
              Persönliche Informationen
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaUser className="text-[#6B46C1]" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-3 bg-white/80 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent transition-all"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-[#6B46C1]" />
                  E-Mail
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-3 bg-white/80 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent transition-all"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="glass-effect p-6">
            <h2 className="text-xl font-semibold text-[#2c1c5b] mb-4 flex items-center gap-2">
              <FaGlobe className="text-[#6B46C1]" />
              Einstellungen
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaGlobe className="text-[#6B46C1]" />
                  Sprache
                </label>
                <select
                  name="language"
                  className="w-full p-3 bg-white/80 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent transition-all"
                  value={form.language}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="en">Englisch</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaBell className="text-[#6B46C1]" />
                  Benachrichtigungen
                </label>
                <div className="flex items-center gap-6 mt-2">
                  <label className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">E-Mail</span>
                    <input
                      type="checkbox"
                      name="notification_preferences.email"
                      checked={form.notification_preferences.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-checkbox h-5 w-5 text-[#6B46C1] rounded border-gray-300 focus:ring-[#6B46C1]"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Push</span>
                    <input
                      type="checkbox"
                      name="notification_preferences.push"
                      checked={form.notification_preferences.push}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-checkbox h-5 w-5 text-[#6B46C1] rounded border-gray-300 focus:ring-[#6B46C1]"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 modern-button"
              >
                <FaSave /> Speichern
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FaTimes /> Abbrechen
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}