
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <nav className="bg-white shadow-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/lovable-uploads/799139f6-aba6-44d5-a4ae-b414f5437f2d.png" alt="Metal Plan Portal" className="h-10 w-10" />
          <span className="font-bold text-2xl bg-gradient-to-r from-zenopurple to-zenoblue bg-clip-text text-transparent">
            MetalScale
          </span>
        </Link>
        
        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <Link to="/admin">
                <Button variant="outline">Panel Admin</Button>
              </Link>
              <Button variant="ghost" onClick={logout}>Cerrar Sesión</Button>
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
