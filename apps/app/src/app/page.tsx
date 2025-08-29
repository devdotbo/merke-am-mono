import AppHeader from "@/components/AppHeader";
import StudioCanvas from "@/components/StudioCanvas";
import ChatBox from "@/components/ChatBox";
import ResizableColumns from "@/components/ResizableColumns";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--foreground)/0.08)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,hsl(var(--foreground)/0.25),hsl(var(--foreground)/0.85))]" />

      <div className="relative z-[5] max-w-none px-4 md:px-6 lg:px-8 xl:px-10 py-4">
        <AppHeader />

        <ResizableColumns
          left={<ChatBox variant="plain" />}
          right={<StudioCanvas variant="plain" />}
          initial={33}
          min={20}
          max={60}
          storageKey="layout.split.home.left"
        />
      </div>
    </div>
  );
}