import {
  Code2,
  Palette,
  FileText,
  Sun,
  Moon,
  GraduationCap,
} from "lucide-react";

export type ViewMode = "code" | "canvas" | "notes";
export type Theme = "light" | "dark";

interface SidebarProps {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export default function Sidebar({
  currentView,
  setCurrentView,
  theme,
  setTheme,
}: SidebarProps) {
  return (
    <div
      className={`flex md:flex-col justify-between items-center p-3 md:py-6 md:px-3 m-3 md:m-6 rounded-2xl md:w-20 md:h-[calc(100vh-3rem)] backdrop-blur-xl transition-all duration-300 z-50 shadow-2xl print:hidden border ${theme === "dark" ? "bg-white/5 border-white/10 shadow-black/50" : "bg-white/60 border-white/40 shadow-gray-200/50"}`}
    >
      {/* Branding */}
      <div className="flex md:flex-col items-center justify-center md:mb-6 shrink-0 md:w-full mr-4 md:mr-0 group cursor-default">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <GraduationCap size={24} />
        </div>
        <span
          className={`hidden md:block text-[9px] font-bold tracking-widest mt-2 uppercase text-center transition-colors duration-300 ${theme === "dark" ? "text-indigo-300 group-hover:text-indigo-200" : "text-indigo-700 group-hover:text-indigo-900"}`}
        >
          Evermont
        </span>
      </div>

      <div className="flex md:flex-col gap-2 md:gap-4 w-full md:w-auto justify-center md:justify-start flex-1">
        <button
          onClick={() => setCurrentView("code")}
          className={`group relative flex flex-col items-center justify-center gap-1.5 w-16 h-16 rounded-xl transition-all duration-300 ${currentView === "code" ? (theme === "dark" ? "bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-blue-500/10 text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.2)]") : theme === "dark" ? "text-gray-400 hover:bg-white/10 hover:text-gray-200" : "text-gray-500 hover:bg-gray-200/50 hover:text-gray-800"}`}
        >
          <Code2
            size={24}
            className={`transition-transform duration-300 ${currentView === "code" ? "scale-110" : "group-hover:scale-110"}`}
          />
          <span className="text-[9px] font-bold tracking-wider uppercase">
            Code
          </span>
        </button>

        <button
          onClick={() => setCurrentView("canvas")}
          className={`group relative flex flex-col items-center justify-center gap-1.5 w-16 h-16 rounded-xl transition-all duration-300 ${currentView === "canvas" ? (theme === "dark" ? "bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-blue-500/10 text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.2)]") : theme === "dark" ? "text-gray-400 hover:bg-white/10 hover:text-gray-200" : "text-gray-500 hover:bg-gray-200/50 hover:text-gray-800"}`}
        >
          <Palette
            size={24}
            className={`transition-transform duration-300 ${currentView === "canvas" ? "scale-110" : "group-hover:scale-110"}`}
          />
          <span className="text-[9px] font-bold tracking-wider uppercase">
            Canvas
          </span>
        </button>

        <button
          onClick={() => setCurrentView("notes")}
          className={`group relative flex flex-col items-center justify-center gap-1.5 w-16 h-16 rounded-xl transition-all duration-300 ${currentView === "notes" ? (theme === "dark" ? "bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-blue-500/10 text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.2)]") : theme === "dark" ? "text-gray-400 hover:bg-white/10 hover:text-gray-200" : "text-gray-500 hover:bg-gray-200/50 hover:text-gray-800"}`}
        >
          <FileText
            size={24}
            className={`transition-transform duration-300 ${currentView === "notes" ? "scale-110" : "group-hover:scale-110"}`}
          />
          <span className="text-[9px] font-bold tracking-wider uppercase">
            Notes
          </span>
        </button>
      </div>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={`p-3 rounded-xl transition-all duration-300 shrink-0 ${theme === "dark" ? "bg-white/5 hover:bg-white/10 text-yellow-500 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]" : "bg-gray-900/5 hover:bg-gray-900/10 text-gray-500 hover:text-gray-900"}`}
        title="Toggle Theme"
      >
        {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    </div>
  );
}
