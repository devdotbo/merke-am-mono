import AppHeader from "@/components/AppHeader";
import CanvasCollab from "@/components/CanvasCollab";
import ChatBox from "@/components/ChatBox";
import AppShowcase from "@/components/AppShowcase";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--foreground)/0.08)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,hsl(var(--foreground)/0.25),hsl(var(--foreground)/0.85))]" />

      <div className="relative z-[5] container mx-auto pl-4 pr-8 md:pr-16 lg:pr-24 xl:pr-32 py-10">
        <AppHeader />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <CanvasCollab />
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Chat</h2>
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
}