
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const isMobile = useIsMobile();
  
  return (
    <nav className="bg-background shadow-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/799139f6-aba6-44d5-a4ae-b414f5437f2d.png" alt="ZenoScale Logo" className="h-10 w-10" />
          <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-zenopurple to-zenoblue bg-clip-text text-transparent">
            ZenoScale
          </span>
        </Link>
        
        <div className="flex gap-3 md:gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link to="/admin">
                <Button variant="outline" className="hidden md:inline-flex">Panel Admin</Button>
                {isMobile && <Button size="sm" variant="outline">Admin</Button>}
              </Link>
              <Button variant="ghost" onClick={logout} className="hidden md:inline-flex">Cerrar Sesión</Button>
              {isMobile && <Button size="sm" variant="ghost" onClick={logout}>Salir</Button>}
            </>
          ) : (
            <Link to="/login">
              <Button className="btn-gradient">Acceder</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
