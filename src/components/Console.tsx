import { LogMessage } from '@/lib/executeCode';
import { Trash2 } from 'lucide-react';

interface ConsoleProps {
  logs: LogMessage[];
  onClear: () => void;
}

export default function Console({ logs, onClear }: ConsoleProps) {
  return (
    <div className="h-full bg-[#111] text-gray-300 font-mono text-sm overflow-hidden flex flex-col border-t border-gray-800">
      <div className="text-gray-400 font-semibold select-none flex justify-between items-center px-6 py-2.5 bg-[#181818] border-b border-gray-800/80 shrink-0">
        <span className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">
          Console Output
        </span>
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Ready</span>
          <button 
            onClick={onClear}
            className="p-1.5 hover:bg-gray-700/50 rounded-md text-gray-400 hover:text-red-400 transition-all flex items-center gap-1.5"
            title="Clear Console"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-1 p-4 overflow-y-auto flex-1">
        {logs.length === 0 ? (
          <span className="text-gray-600 italic">No output...</span>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index}
              className={`py-1 border-b border-gray-800/50 ${
                log.type === 'error' ? 'text-red-400' : 
                log.type === 'warn' ? 'text-yellow-400' : 'text-green-300'
              }`}
            >
              <span className="opacity-50 mr-2 select-none">&gt;</span>
              <span className="whitespace-pre-wrap wrap-break-word">{log.content}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
