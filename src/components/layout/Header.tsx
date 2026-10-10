import { ModeToggle } from "../mode-toggle";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const toLogin = () => {
    router.push("auth/login");
  };

  return (
    <header className="flex justify-between">
      <ModeToggle />
      <Link href="/" className="font-bold text-lg tracking-tight font-passion">
        Trmit
      </Link>
      <Button
        onClick={toLogin}
        variant="ghost"
        size="icon"
        aria-label="Inicio/Registro"
        className="hover:text-black "
        disabled={pathname.startsWith("/auth")}
      >
        <UserRound className="w-5 h-5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-white transition-colors" />
      </Button>
    </header>
  );
}
