export default function ProfileSelector({ currentProfile, onSelectProfile }) {
  const profiles = [
    { id: "casual", label: "Casual", icon: "☕" },
    { id: "runner", label: "Runner", icon: "🏃" },
    { id: "sensitive", label: "Sensitive Lungs", icon: "🫁" },
    { id: "worker", label: "Outdoor Worker", icon: "🚧" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Profile</span>
      <div className="flex flex-wrap gap-2">
        {profiles.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectProfile(p.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              currentProfile === p.id
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}