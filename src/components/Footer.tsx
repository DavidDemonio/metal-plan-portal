
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/lovable-uploads/799139f6-aba6-44d5-a4ae-b414f5437f2d.png" alt="Metal Plan Portal" className="h-8 w-8" />
              <span className="font-bold text-xl bg-gradient-to-r from-zenopurple to-zenoblue bg-clip-text text-transparent">
                MetalScale
              </span>
            </div>
            <p className="text-zinc-400">
              Servicios de alto rendimiento para tus aplicaciones y servidores.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-zinc-400 hover:text-white">Inicio</Link></li>
              <li><Link to="/planes" className="text-zinc-400 hover:text-white">Planes</Link></li>
              <li><Link to="/contacto" className="text-zinc-400 hover:text-white">Contacto</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-zinc-400 hover:text-white">Documentación</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white">Estado de Servicios</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-zinc-400">soporte@metalscale.com</li>
              <li className="text-zinc-400">+34 900 123 456</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-zinc-500">
          <p>&copy; {new Date().getFullYear()} MetalScale. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
