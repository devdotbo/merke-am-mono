import AppHeader from "@/components/AppHeader";
import StudioCanvas from "@/components/StudioCanvas";
import ChatBox from "@/components/ChatBox";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0 [background-image:radial-gradient(hsl(var(--foreground)/0.08)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_bottom,hsl(var(--foreground)/0.25),hsl(var(--foreground)/0.85))]" />

      <div className="relative z-[5] container mx-auto px-4 md:px-8 lg:px-12 xl:px-16 py-6">
        <AppHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-stretch">
          {/* Left column: Chat 1/3 */}
          <div className="lg:col-span-1 h-[calc(100vh-180px)] flex flex-col">
            <div className="sr-only">Chat</div>
            <div className="flex-1 min-h-0">
              <ChatBox variant="plain" />
            </div>
          </div>
          {/* Right column: Studio 2/3 */}
          <div className="lg:col-span-2 h-[calc(100vh-180px)] flex flex-col">
            <div className="sr-only">Studio</div>
            <div className="flex-1 min-h-0">
              <StudioCanvas variant="plain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}