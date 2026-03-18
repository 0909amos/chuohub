import { Outlet } from "@tanstack/react-router";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  return (
    <div className="flex justify-center bg-background min-h-screen">
      <div className="w-full max-w-[430px] relative bg-background min-h-screen pb-20">
        <main className="min-h-screen">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
