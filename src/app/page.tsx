import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeroSection } from "@/features/links/components/hero-component";
import { Sun, UserRound } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#e9e9e9] text-black flex flex-col p-6 relative dark:bg-[#161616] dark:text-white">
      <header className="flex justify-between">
        <ModeToggle />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Inicio/Registro"
          className="hover:text-black "
        >
          <UserRound className="w-5 h-5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white transition-colors" />
        </Button>
      </header>
      <HeroSection />
    </main>
  );
}
