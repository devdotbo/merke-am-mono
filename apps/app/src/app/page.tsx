import AppHeader from "@/components/AppHeader";
import CanvasCollab from "@/components/CanvasCollab";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--foreground)/0.08)_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Full-bleed canvas layer */}
      <div className="absolute inset-0">
        <CanvasCollab />
      </div>

      {/* Header overlay */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <AppHeader />
      </div>

      {/* Chat overlay removed; use Add Chat button to spawn chat as a node */}
    </div>
  );
}