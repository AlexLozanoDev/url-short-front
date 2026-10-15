import { ModeToggle } from "../mode-toggle";
import Link from "next/link";
import { LogOut, UserRound, LayoutDashboard } from "lucide-react"; 
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useAuth } from "@/features/auth/context/auth-context";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isDashboard = pathname === "/dashboard";
  const isHome = pathname === "/";

  let Icon = UserRound;
  let onClickAction = () => router.push("/auth/login");
  let ariaLabel = "Iniciar sesión";

  if (isAuthenticated) {
    if (isDashboard) {
      Icon = LogOut;
      onClickAction = logout;
      ariaLabel = "Cerrar sesión";
    } else if (isHome) {
      Icon = LayoutDashboard;
      onClickAction = () => router.push("/dashboard");
      ariaLabel = "Ir al Dashboard";
    }
  }

  return (
    <header className="flex justify-between items-center">
      <ModeToggle />
      <Link href="/" className="font-bold text-lg tracking-tight font-passion">
        Trmit
      </Link>
      <Button
        onClick={onClickAction}
        variant="ghost"
        size="icon"
        aria-label={ariaLabel}
        className="hover:text-black dark:hover:text-white"
        disabled={pathname.startsWith("/auth")}
      >
        <Icon className="w-5 h-5 text-zinc-800 dark:text-white transition-colors" />
      </Button>
    </header>
  );
}
