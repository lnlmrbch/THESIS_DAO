import React from "react";
import { FaCoins } from "react-icons/fa";

export default function ActivityList({ activities }) {
  // Filtere nur Käufe
  const buyActivities = activities.filter(activity => activity.type === "buy");

  if (!buyActivities.length) {
    return (
      <div className="text-center text-gray-500 py-4">
        Noch keine Käufe vorhanden.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {buyActivities.map((activity, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#6B46C1] text-white flex items-center justify-center">
            <FaCoins className="w-5 h-5" />
          </div>
          <div className="flex-grow">
            <p className="text-sm text-gray-900">{activity.description}</p>
            <p className="text-xs text-gray-500">
              {new Date(activity.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 