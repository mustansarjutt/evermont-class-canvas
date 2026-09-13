"use client";

import { useState } from "react";
import NotesView from "@/components/NotesView";
import Sidebar, { Theme, ViewMode } from "@/components/Sidebar";
import CodeWorkspace from "@/components/CodeWorkspace";
import CanvasWorkspace from "@/components/CanvasWorkspace";

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewMode>("code");
  const [theme, setTheme] = useState<Theme>("dark");
  const [notes, setNotes] = useState("");

  const handleSaveNote = (code: string) => {
    const newNote = `\n\n\`\`\`javascript\n${code}\n\`\`\`\n`;
    setNotes((prev) => prev + newNote);
    setCurrentView("notes");
  };


  return (
    <div
      className={`fixed inset-0 overflow-hidden flex flex-col-reverse md:flex-row transition-colors duration-300 ${theme === "dark" ? "bg-[#1e1e1e] text-white dark" : "bg-gray-100 text-gray-900"}`}
    >
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        theme={theme} 
        setTheme={setTheme} 
      />
      <div className="flex-1 flex overflow-hidden relative">
        <div
          className={`absolute inset-0 flex flex-col transition-opacity duration-300 print:hidden ${currentView === "code" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
        >
          <CodeWorkspace theme={theme} onSaveNote={handleSaveNote} />
        </div>
        <div
          className={`absolute inset-0 flex flex-col p-4 md:p-6 gap-4 transition-opacity duration-300 print:hidden ${currentView === "canvas" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
        >
          <CanvasWorkspace theme={theme} />
        </div>
        <div
          className={`absolute inset-0 flex flex-col transition-opacity duration-300 print:opacity-100 print:relative print:z-50 print:block ${currentView === "notes" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
        >
          <NotesView theme={theme} notes={notes} />
        </div>
      </div>
    </div>
  );
}
