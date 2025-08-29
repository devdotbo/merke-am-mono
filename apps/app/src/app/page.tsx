import AppHeader from "@/components/AppHeader";
import StudioCanvas from "@/components/StudioCanvas";
import ChatBox from "@/components/ChatBox";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--foreground)/0.08)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,hsl(var(--foreground)/0.25),hsl(var(--foreground)/0.85))]" />

      <div className="relative z-[5] container mx-auto pl-4 pr-8 md:pr-16 lg:pr-24 xl:pr-32 py-10">
        <AppHeader />

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">
          {/* Left column: Chat full height */}
          <div className="flex flex-col h-[calc(100vh-180px)]">
            <h2 className="text-xl font-semibold mb-3 lg:mb-4">Chat</h2>
            <div className="flex-1 min-h-0">
              <ChatBox />
            </div>
          </div>
          {/* Right column: Studio canvas */}
          <div className="flex flex-col h-[calc(100vh-180px)]">
            <h2 className="text-xl font-semibold mb-3 lg:mb-4">Studio</h2>
            <div className="flex-1 min-h-0">
              <StudioCanvas />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}