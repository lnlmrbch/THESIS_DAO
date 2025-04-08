import React from "react";

export default function RoleLegend() {
  const roles = [
    {
      emoji: "🧠",
      title: "Core Team",
      description: "Verwalten den Smart Contract & Einstellungen. Können Rollen vergeben.",
    },
    {
      emoji: "👥",
      title: "Community",
      description: "Token Holder. Dürfen Proposals erstellen und abstimmen.",
    },
    {
      emoji: "💼",
      title: "Finance Committee",
      description: "Kontrollieren Ausgaben & Budgets. Dürfen Proposals finalisieren.",
    },
  ];

  return (
    <section className="max-w-4xl mx-auto mt-24 mb-10 px-6">
      <div className="bg-[#111111] border border-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4 tracking-tight">
          🧾 Rollenübersicht
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 text-sm text-gray-300">
          {roles.map((role, i) => (
            <div key={i} className="bg-[#181818] p-4 rounded-lg border border-gray-700">
              <div className="text-lg font-semibold text-white mb-1">
                {role.emoji} {role.title}
              </div>
              <p className="text-gray-400">{role.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
