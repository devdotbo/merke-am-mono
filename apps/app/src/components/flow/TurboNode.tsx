import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';

type TurboData = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

export default function TurboNode({ data, selected }: NodeProps<TurboData>) {
  return (
    <div
      className={
        `group relative rounded-xl border-2 bg-background px-4 py-3 shadow-sm` +
        (selected ? ' border-primary' : ' border-border/70')
      }
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#ae53ba33] to-[#2a8af633]">
          {data.icon ?? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-foreground/70">
              <path d="M12 3l9 6-9 6-9-6 9-6z" stroke="currentColor" />
            </svg>
          )}
        </div>
        <div>
          <div className="text-sm font-semibold leading-5">{data.title}</div>
          {data.subtitle && <div className="text-xs text-muted-foreground">{data.subtitle}</div>}
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!bg-foreground/60" />
      <Handle type="source" position={Position.Bottom} className="!bg-foreground/60" />
    </div>
  );
}


