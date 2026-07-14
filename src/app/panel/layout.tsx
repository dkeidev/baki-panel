import Sidebar from "./_components/Sidebar";
import UserProfileWidget from "./_components/UserProfileWidget";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex justify-center w-full panel-bg-animated overflow-hidden">
      {/* Inner panel container with balanced shadows & borders for light/dark mode */}
      <div className="w-full max-w-[1728px] flex flex-col md:flex-row text-foreground h-full border-x border-outline/5 dark:border-outline/15 shadow-2xl dark:shadow-[0_0_80px_-20px_rgba(0,0,0,0.9)] bg-background/95 backdrop-blur-md overflow-hidden">
        <Sidebar userProfileWidget={<UserProfileWidget />} />
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="w-full px-6 py-8 md:py-10 flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
