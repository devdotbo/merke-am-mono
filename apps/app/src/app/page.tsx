import AppHeader from "@/components/AppHeader";
import StudioCanvas from "@/components/StudioCanvas";
import ChatBox from "@/components/ChatBox";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--foreground)/0.08)_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Full-bleed canvas layer */}
      <div className="absolute inset-0">
        <StudioCanvas variant="plain" />
      </div>

      {/* Header overlay */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <AppHeader />
      </div>

      {/* Chat overlay */}
      <div className="absolute left-4 bottom-4 w-[440px] max-w-[92vw] z-20">
        <ChatBox variant="card" />
      </div>
    </div>
  );
}