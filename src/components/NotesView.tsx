/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vs,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Download, FileText, Trash2, Loader2 } from "lucide-react";

type NotesViewProps = {
  theme: "light" | "dark";
  notes: string;
  onClearNotes: () => void;
};

export default function NotesView({ theme, notes, onClearNotes }: NotesViewProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  // Custom components to style the markdown without needing @tailwindcss/typography
  const components: any = {
    h1: ({ node: _node, ...props }: any) => (
      <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />
    ),
    h2: ({ node: _node, ...props }: any) => (
      <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />
    ),
    h3: ({ node: _node, ...props }: any) => (
      <h3 className="text-xl font-bold mt-4 mb-2" {...props} />
    ),
    p: ({ node: _node, ...props }: any) => (
      <p className="mb-4 leading-relaxed" {...props} />
    ),
    ul: ({ node: _node, ...props }: any) => (
      <ul className="list-disc pl-6 mb-4" {...props} />
    ),
    ol: ({ node: _node, ...props }: any) => (
      <ol className="list-decimal pl-6 mb-4" {...props} />
    ),
    li: ({ node: _node, ...props }: any) => <li className="mb-1" {...props} />,
    a: ({ node: _node, ...props }: any) => (
      <a className="text-blue-500 hover:underline" {...props} />
    ),
    blockquote: ({ node: _node, ...props }: any) => (
      <blockquote
        className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-500"
        {...props}
      />
    ),
    img: ({ node: _node, ...props }: any) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={props.alt || ""}
        className="max-w-full h-auto rounded-lg shadow-md my-4 border border-gray-200 dark:border-gray-700"
        {...props}
      />
    ),
    code({ node: _node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <div className="rounded-lg overflow-hidden my-4 shadow-sm">
          <SyntaxHighlighter
            style={theme === "dark" ? vscDarkPlus : vs}
            language={match[1]}
            PreTag="div"
            customStyle={{ margin: 0, padding: "1rem" }}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          className={`px-1.5 py-0.5 rounded text-sm font-mono ${theme === "dark" ? "bg-gray-800 text-blue-300" : "bg-gray-200 text-blue-700"}`}
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  const handleSaveAsPDF = async () => {
    if (notes.trim() === "") return;
    
    try {
      setIsPrinting(true);
      // Wait for React to re-render and remove overflow-y-auto
      await new Promise((resolve) => setTimeout(resolve, 100));

      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("notes-content-area");
      if (!element) return;

      const opt = {
        margin: 10,
        filename: `class-notes-${Date.now()}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, windowWidth: 1024 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error("Failed to generate PDF:", e);
      alert("Failed to generate PDF. Make sure html2pdf.js is installed.");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div
      className={`h-full w-full flex flex-col p-6 transition-colors duration-300 print:bg-white print:p-0 ${theme === "dark" ? "bg-[#1e1e1e] text-gray-200" : "bg-gray-50 text-gray-800"}`}
    >
      <div className="flex justify-between items-center mb-4 print:hidden">
        <h2 className="text-2xl font-bold">Class Notes</h2>
        <div className="flex gap-3">
          <button
            onClick={onClearNotes}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md ${
              theme === "dark"
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            <Trash2 size={16} /> Clear Notes
          </button>
          <button
            onClick={handleSaveAsPDF}
            disabled={isPrinting || notes.trim() === ""}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md ${
              isPrinting || notes.trim() === "" ? "opacity-50 cursor-not-allowed" : ""
            } ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isPrinting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {isPrinting ? "Saving..." : "Save as PDF"}
          </button>
        </div>
      </div>

      <div
        className={`flex-1 w-full rounded-xl border transition-colors duration-300 shadow-inner print:shadow-none print:border-none print:rounded-none ${
          theme === "dark"
            ? "border-gray-700 bg-gray-900 print:bg-white print:text-black"
            : "border-gray-300 bg-white"
        } ${isPrinting ? "overflow-visible h-max" : "overflow-hidden"}`}
      >
        <div
          id="notes-content-area"
          className={`w-full p-6 print:overflow-visible ${isPrinting ? "h-max overflow-visible" : "h-full overflow-y-auto"}`}
        >
          {notes.trim() === "" ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2 print:hidden">
              <FileText size={32} className="opacity-50" />
              <p>
                No notes yet. Save notes from the Code Editor or Canvas to see
                them here.
              </p>
            </div>
          ) : (
            <ReactMarkdown components={components}>{notes}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
