export default function Toolbar({ darkMode, onToggleDarkMode, fontSize, onChangeFontSize }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Font Size:</span>
        <button
          onClick={() => onChangeFontSize(fontSize - 2)}
          disabled={fontSize <= 12}
          className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          -
        </button>
        <span className="text-sm font-semibold w-12 text-center">{fontSize}px</span>
        <button
          onClick={() => onChangeFontSize(fontSize + 2)}
          disabled={fontSize >= 22}
          className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          +
        </button>
      </div>

      <button
        onClick={onToggleDarkMode}
        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center space-x-2"
        aria-label="Toggle Dark Mode"
      >
        <span>{darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
      </button>
    </div>
  );
}