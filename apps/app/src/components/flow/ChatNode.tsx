"use client";

import React, { useState, useRef, useCallback } from "react";
import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import ChatBox from "@/components/ChatBox";

type Data = { roomId?: string };

export default function ChatNode({ data }: NodeProps<Data>) {
  const [size, setSize] = useState({ width: 460, height: 340 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing.current = true;

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;
      
      const newWidth = Math.max(280, Math.min(800, startWidth + moveEvent.clientX - startX));
      const newHeight = Math.max(200, Math.min(window.innerHeight * 0.8, startHeight + moveEvent.clientY - startY));
      
      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [size]);

  return (
    <div className="max-w-[92vw]">
      {/* Drag handle bar (keeps node draggable) */}
      <div className="h-2 w-full cursor-grab active:cursor-grabbing" />
      {/* Resizable container */}
      <div 
        ref={containerRef}
        className="nodrag relative overflow-hidden rounded-xl border border-border bg-background/80 backdrop-blur"
        style={{ width: `${size.width}px`, height: `${size.height}px` }}
      >
        <ChatBox defaultThreadId={data.roomId ?? "home"} variant="plain" />
        {/* Resize handle */}
        <div 
          onMouseDown={handleMouseDown}
          className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize bg-primary/20 hover:bg-primary/30 transition-colors z-50"
          style={{
            borderTopLeftRadius: '4px',
          }}
        >
          <svg className="w-full h-full p-1 text-foreground" viewBox="0 0 24 24" fill="none">
            <path d="M20 20L14 20M20 20L20 14M20 20L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2" />
    </div>
  );
}


