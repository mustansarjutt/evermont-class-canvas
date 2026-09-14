"use client";

import React, { useRef, useState, useEffect } from "react";
import { Square, Circle, Monitor, Server, Database, Cloud, Eraser } from "lucide-react";
import { Theme } from "./Sidebar";

interface CanvasWorkspaceProps {
  theme: Theme;
}

const ICONS = {
  computer: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>`,
  server: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
  database: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
  cloud: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`
};

const colors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#ffffff" },
  { name: "Red", value: "#ff0000" },
  { name: "Blue", value: "#0000ff" },
  { name: "Green", value: "#008000" },
  { name: "Purple", value: "#800080" },
];

export default function CanvasWorkspace({ theme }: CanvasWorkspaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"draw" | "erase" | "text" | "shape" | "icon">("draw");
  const [shapeType, setShapeType] = useState<"rect" | "round-rect" | "circle">("rect");
  const [iconType, setIconType] = useState<"computer" | "server" | "database" | "cloud">("computer");
  
  // Snapshot engine for interactive drag preview
  const snapshotRef = useRef<ImageData | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [fontSize, setFontSize] = useState(24);

  const [textInput, setTextInput] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: "",
  });

  const getProcessedDataURL = () => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    
    if (theme === "dark") {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCtx.filter = "invert(1) hue-rotate(180deg)";
        tempCtx.drawImage(canvas, 0, 0);
        return tempCanvas.toDataURL("image/png");
      }
    }
    return canvas.toDataURL("image/png");
  };

  const drawStateRef = useRef({ color, lineWidth, mode });
  useEffect(() => {
    drawStateRef.current = { color, lineWidth, mode };
  }, [color, lineWidth, mode]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newWidth = Math.round(rect.width);
        const newHeight = Math.round(rect.height);

        // Only resize if different to prevent clearing inadvertently
        if (
          canvasRef.current.width !== newWidth ||
          canvasRef.current.height !== newHeight
        ) {
          const ctx = canvasRef.current.getContext("2d");
          let imageData: ImageData | null = null;
          
          if (ctx && canvasRef.current.width > 0 && canvasRef.current.height > 0) {
            try {
               imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            } catch {}
          }

          canvasRef.current.width = newWidth;
          canvasRef.current.height = newHeight;

          if (ctx) {
            // Always draw on a white background. Dark mode is handled via CSS invert.
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height,
            );
            
            if (imageData) {
              ctx.putImageData(imageData, 0, 0);
            }
            
            const { color: currColor, lineWidth: currLineWidth, mode: currMode } = drawStateRef.current;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = currMode === "erase" ? "#ffffff" : currColor;
            ctx.lineWidth = currLineWidth;
            contextRef.current = ctx;
          }
        }
      }
    };

    // Initial sizing (requires a tiny timeout to ensure container is rendered)
    setTimeout(handleResize, 10);

    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []); // Empty dependency array to bind resize observer only once

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = mode === "erase" ? "#ffffff" : color;
      contextRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth, mode]);

  const commitText = () => {
    const ctx = contextRef.current;
    if (ctx && textInput.value.trim() !== "") {
      ctx.font = `500 ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = color;
      ctx.textBaseline = "top";
      ctx.fillText(textInput.value, textInput.x, textInput.y);
    }
    setTextInput((prev) => ({ ...prev, visible: false, value: "" }));
  };

  const iconImagesRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    const newImages: Record<string, HTMLImageElement> = {};
    for (const [key, svg] of Object.entries(ICONS)) {
      const coloredSvg = svg.replace('currentColor', color);
      const blob = new Blob([coloredSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;
      newImages[key] = img;
    }
    iconImagesRef.current = newImages;
    
    return () => {
      Object.values(newImages).forEach(img => {
        URL.revokeObjectURL(img.src);
      });
    };
  }, [color]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    if (mode === "draw" || mode === "erase") {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    } else if (mode === "shape" || mode === "icon") {
      if (canvasRef.current) {
        snapshotRef.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      startPosRef.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      setIsDrawing(true);
    } else if (mode === "text") {
      if (textInput.visible) {
        commitText();
      }
      setTextInput({
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
        visible: true,
        value: "",
      });
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = contextRef.current;
    if (!isDrawing || !ctx) return;

    if (mode === "draw" || mode === "erase") {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    } else if (mode === "shape" || mode === "icon") {
      if (!snapshotRef.current || !startPosRef.current) return;
      
      // Restore previous state to clear the last drawn preview frame
      ctx.putImageData(snapshotRef.current, 0, 0);

      const startX = startPosRef.current.x;
      const startY = startPosRef.current.y;
      const currentX = e.nativeEvent.offsetX;
      const currentY = e.nativeEvent.offsetY;

      const w = currentX - startX;
      const h = currentY - startY;

      ctx.beginPath();
      if (mode === "shape") {
        if (shapeType === "rect") {
          ctx.rect(startX, startY, w, h);
        } else if (shapeType === "round-rect") {
          ctx.roundRect(startX, startY, w, h, [16]);
        } else if (shapeType === "circle") {
          ctx.ellipse(startX + w / 2, startY + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, 2 * Math.PI);
        }
        ctx.stroke();
      } else if (mode === "icon") {
        const img = iconImagesRef.current[iconType];
        if (img) {
           const drawX = w < 0 ? currentX : startX;
           const drawY = h < 0 ? currentY : startY;
           ctx.drawImage(img, drawX, drawY, Math.abs(w), Math.abs(h));
        }
      }
    }
  };

  const handlePointerUp = () => {
    const ctx = contextRef.current;
    if (!ctx) return;
    
    if (mode === "draw" || mode === "erase") {
      ctx.closePath();
    } else if (mode === "shape" || mode === "icon") {
      snapshotRef.current = null;
      startPosRef.current = null;
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = contextRef.current;
    if (ctx && canvasRef.current) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (textInput.visible) {
      setTextInput((prev) => ({ ...prev, visible: false, value: "" }));
    }
  };

  const downloadImage = () => {
    const dataUrl = getProcessedDataURL();
    if (dataUrl) {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `class-canvas-${Date.now()}.png`;
      a.click();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-6">
      
      {/* Floating Canvas Board */}
      <div
        className={`relative w-full flex-1 rounded-4xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300 border-2 ${
          theme === "dark"
            ? "shadow-black/70 border-white/10 bg-black"
            : "shadow-gray-400/50 border-white bg-white"
        }`}
        ref={containerRef}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerOut={handlePointerUp}
          className={`block touch-none w-full h-full transition-[filter] duration-300 ${mode === "text" ? "cursor-text" : "cursor-crosshair"}`}
          style={{
            filter:
              theme === "dark" ? "invert(1) hue-rotate(180deg)" : "none",
          }}
        />

        {textInput.visible && (
          <input
            ref={inputRef}
            type="text"
            value={textInput.value}
            onChange={(e) =>
              setTextInput({ ...textInput, value: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") commitText();
              if (e.key === "Escape")
                setTextInput((prev) => ({
                  ...prev,
                  visible: false,
                  value: "",
                }));
            }}
            onBlur={commitText}
            style={{
              position: "absolute",
              left: textInput.x,
              top: textInput.y - fontSize * 0.1,
              fontSize: `${fontSize}px`,
              color: color,
              background: "transparent",
              border: "2px dashed #3b82f6",
              outline: "none",
              padding: "0 4px",
              margin: 0,
              lineHeight: 1,
              zIndex: 10,
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 500,
              filter: theme === "dark" ? "invert(1) hue-rotate(180deg)" : "none",
            }}
          />
        )}
      </div>

      {/* Toolbar (Floating Glassmorphism Dock, placed below the board) */}
      <div className={`shrink-0 z-20 backdrop-blur-3xl px-6 py-4 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border flex flex-wrap items-center justify-center gap-6 transition-colors duration-300 max-w-[95%] ${
        theme === "dark"
          ? "bg-gray-900/80 border-white/10 shadow-black/50"
          : "bg-white/80 border-white/60 shadow-gray-300/50"
      }`}>
        
        {/* Left Group: Modes */}
        <div className={`flex gap-2 p-1.5 rounded-2xl transition-colors duration-300 ${theme === "dark" ? "bg-black/40" : "bg-gray-100/80"}`}>
          <button
            onClick={() => {
              setMode("draw");
              if (textInput.visible) commitText();
            }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${mode === "draw" ? (theme === "dark" ? "bg-gray-700 text-white shadow-md" : "bg-white text-gray-900 shadow-md") : theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            Draw
          </button>
          <button
            onClick={() => {
              setMode("erase");
              if (textInput.visible) commitText();
            }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${mode === "erase" ? (theme === "dark" ? "bg-gray-700 text-white shadow-md" : "bg-white text-gray-900 shadow-md") : theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
            title="Eraser"
          >
            <Eraser size={16} /> Erase
          </button>
          <button
            onClick={() => setMode("text")}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${mode === "text" ? (theme === "dark" ? "bg-gray-700 text-white shadow-md" : "bg-white text-gray-900 shadow-md") : theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            Text
          </button>
          <button
            onClick={() => setMode("shape")}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${mode === "shape" ? (theme === "dark" ? "bg-gray-700 text-white shadow-md" : "bg-white text-gray-900 shadow-md") : theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            Shape
          </button>
          <button
            onClick={() => setMode("icon")}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${mode === "icon" ? (theme === "dark" ? "bg-gray-700 text-white shadow-md" : "bg-white text-gray-900 shadow-md") : theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            Icon
          </button>
        </div>

        {/* Colors */}
        <div className="flex gap-2 items-center px-2">
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setColor(c.value)}
              className={`relative w-9 h-9 rounded-full border-2 transition-all hover:scale-110 shadow-sm overflow-hidden ${color === c.value ? (theme === "dark" ? "border-gray-300 scale-110 shadow-md" : "border-gray-800 scale-110 shadow-md") : theme === "dark" ? "border-white/10" : "border-transparent"}`}
              title={c.name}
            >
              <div 
                className="absolute inset-0 w-full h-full rounded-full"
                style={{ 
                  backgroundColor: c.value,
                  filter: theme === "dark" ? "invert(1) hue-rotate(180deg)" : "none"
                }}
              />
            </button>
          ))}
        </div>

        {/* Dynamic Settings */}
        <div className={`flex items-center gap-4 px-5 py-2.5 rounded-2xl transition-colors duration-300 ${theme === "dark" ? "bg-black/40" : "bg-gray-100/80"}`}>
          {mode === "draw" || mode === "shape" || mode === "erase" ? (
            <div className={`flex items-center gap-4 text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              {mode === "shape" && (
                <div className="flex gap-2 mr-2">
                  <button onClick={() => setShapeType("rect")} className={`p-2 rounded-xl transition-all ${shapeType === "rect" ? "bg-blue-500/20 text-blue-500" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`} title="Square"><Square size={20} /></button>
                  <button onClick={() => setShapeType("round-rect")} className={`p-2 rounded-xl transition-all ${shapeType === "round-rect" ? "bg-blue-500/20 text-blue-500" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`} title="Rounded Square"><Square size={20} rx={4} /></button>
                  <button onClick={() => setShapeType("circle")} className={`p-2 rounded-xl transition-all ${shapeType === "circle" ? "bg-blue-500/20 text-blue-500" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`} title="Circle"><Circle size={20} /></button>
                  <div className="w-px h-8 bg-gray-500/30 mx-2 self-center"></div>
                </div>
              )}
              <span>Stroke</span>
              <input
                type="range"
                min="1"
                max="30"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-24 accent-blue-500"
              />
            </div>
          ) : mode === "icon" ? (
            <div className={`flex items-center gap-2 text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              <button onClick={() => setIconType("computer")} className={`p-2 rounded-xl transition-all ${iconType === "computer" ? "bg-blue-500/20 text-blue-500" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`} title="Computer"><Monitor size={20} /></button>
              <button onClick={() => setIconType("server")} className={`p-2 rounded-xl transition-all ${iconType === "server" ? "bg-blue-500/20 text-blue-500" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`} title="Server"><Server size={20} /></button>
              <button onClick={() => setIconType("database")} className={`p-2 rounded-xl transition-all ${iconType === "database" ? "bg-blue-500/20 text-blue-500" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`} title="Database"><Database size={20} /></button>
              <button onClick={() => setIconType("cloud")} className={`p-2 rounded-xl transition-all ${iconType === "cloud" ? "bg-blue-500/20 text-blue-500" : "hover:bg-gray-200 dark:hover:bg-gray-700"}`} title="Cloud"><Cloud size={20} /></button>
            </div>
          ) : (
            <div className={`flex items-center gap-4 text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              <div className="flex items-center gap-3">
                <span>Size</span>
                <input
                  type="range"
                  min="16"
                  max="120"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-24 accent-blue-500"
                />
                <span className="w-10 text-xs text-right">{fontSize}px</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={clearCanvas}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${theme === "dark" ? "bg-white/10 hover:bg-white/20 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
          >
            Clear
          </button>
          <button
            onClick={downloadImage}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hidden md:block"
          >
            Export PNG
          </button>
        </div>
      </div>
    </div>
  );
}
