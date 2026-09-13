"use client";

import React, { useState, useRef, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import Console from './Console';
import { executeCode, LogMessage } from '@/lib/executeCode';
import { Theme } from './Sidebar';

interface CodeWorkspaceProps {
  theme: Theme;
  onSaveNote: (code: string) => void;
}

export default function CodeWorkspace({ theme, onSaveNote }: CodeWorkspaceProps) {
  const [code, setCode] = useState('');
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [consoleHeight, setConsoleHeight] = useState(30); // percentage
  const isDraggingConsole = useRef(false);

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (isDraggingConsole.current) {
        const vh = window.innerHeight;
        const newHeight = ((vh - e.clientY) / vh) * 100;
        setConsoleHeight(Math.max(10, Math.min(newHeight, 80)));
      }
    };

    const handleGlobalPointerUp = () => {
      if (isDraggingConsole.current) {
        isDraggingConsole.current = false;
        document.body.style.cursor = "default";
      }
    };

    window.addEventListener("pointermove", handleGlobalPointerMove);
    window.addEventListener("pointerup", handleGlobalPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, []);

  const startConsoleResize = (e: React.PointerEvent) => {
    isDraggingConsole.current = true;
    document.body.style.cursor = "ns-resize";
    e.preventDefault();
  };

  const handleRunCode = async () => {
    setLogs([{ type: "log", content: "Running..." }]);
    const result = await executeCode(code);
    setLogs(result);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      <div
        className="relative w-full"
        style={{ height: `${100 - consoleHeight}%` }}
      >
        <CodeEditor
          code={code}
          onChange={(val) => setCode(val || "")}
          onRun={handleRunCode}
          onSaveNote={() => onSaveNote(code)}
        />
      </div>

      {/* Draggable Resizer */}
      <div
        className={`h-2 cursor-ns-resize transition-colors hover:bg-blue-500 z-20 w-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-300"}`}
        onPointerDown={startConsoleResize}
      />

      <div
        className="relative w-full flex flex-col"
        style={{ height: `${consoleHeight}%` }}
      >
        <Console logs={logs} onClear={() => setLogs([])} />
      </div>
    </div>
  );
}
