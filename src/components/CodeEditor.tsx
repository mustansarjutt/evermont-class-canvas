"use client";

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Save, Minus, Plus } from 'lucide-react';

type CodeEditorProps = {
  code: string;
  onChange: (value: string | undefined) => void;
  onRun: () => void;
  onSaveNote?: () => void;
};

export default function CodeEditor({ code, onChange, onRun, onSaveNote }: CodeEditorProps) {
  const [fontSize, setFontSize] = useState(14);

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 bg-[#181818] border-b border-gray-800/60 shadow-sm z-10 gap-3 sm:gap-0">
        <span className="text-gray-200 font-bold text-xs uppercase tracking-widest flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-yellow-400 drop-shadow-md shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
            Javascript
          </div>
          
          {/* Mobile-only Font Size Control */}
          <div className="flex sm:hidden items-center gap-1 bg-[#252526] border border-gray-700/50 rounded-lg p-0.5 shadow-inner">
            <button 
              onClick={() => setFontSize(f => Math.max(8, f - 2))}
              className="p-1 hover:bg-gray-700/50 rounded-md text-gray-400 hover:text-white transition-all"
              title="Decrease Font Size"
            >
              <Minus size={14} />
            </button>
            <span className="text-gray-300 text-xs w-6 text-center font-bold">{fontSize}</span>
            <button 
              onClick={() => setFontSize(f => Math.min(32, f + 2))}
              className="p-1 hover:bg-gray-700/50 rounded-md text-gray-400 hover:text-white transition-all"
              title="Increase Font Size"
            >
              <Plus size={14} />
            </button>
          </div>
        </span>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Desktop Font Size Control */}
          <div className="hidden sm:flex items-center gap-1 bg-[#252526] border border-gray-700/50 rounded-lg p-0.5 shadow-inner">
            <button 
              onClick={() => setFontSize(f => Math.max(8, f - 2))}
              className="p-1 hover:bg-gray-700/50 rounded-md text-gray-400 hover:text-white transition-all"
              title="Decrease Font Size"
            >
              <Minus size={14} />
            </button>
            <span className="text-gray-300 text-xs w-6 text-center font-bold">{fontSize}</span>
            <button 
              onClick={() => setFontSize(f => Math.min(32, f + 2))}
              className="p-1 hover:bg-gray-700/50 rounded-md text-gray-400 hover:text-white transition-all"
              title="Increase Font Size"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
          {onSaveNote && (
            <button 
              onClick={onSaveNote}
              className="flex-1 sm:flex-none justify-center bg-[#2d2d2d] hover:bg-[#3d3d3d] border border-gray-700 text-gray-200 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
              title="Save code snippet to Notes"
            >
              <Save size={14} className="shrink-0" />
              <span className="hidden sm:inline">Save Note</span>
              <span className="inline sm:hidden">Save</span>
            </button>
          )}
          <button 
            onClick={onRun}
            className="flex-1 sm:flex-none justify-center bg-blue-600 hover:bg-blue-500 text-white px-3 sm:px-5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 whitespace-nowrap"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="shrink-0"><path d="M8 5v14l11-7z"/></svg>
            <span className="hidden sm:inline">Run Code</span>
            <span className="inline sm:hidden">Run</span>
          </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full relative">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: fontSize,
            wordWrap: 'on',
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste: true,
          }}
        />
      </div>
    </div>
  );
}
