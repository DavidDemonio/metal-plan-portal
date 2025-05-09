
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const Hero = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`${theme === 'dark' ? 'bg-gradient-to-br from-zinc-900 to-zinc-950' : 'bg-gradient-to-br from-zinc-50 to-zinc-100'} py-16 md:py-20 px-4 rounded-3xl mx-4 mt-6 transition-colors duration-300`}>
      <div className="container mx-auto text-center">
        <div className="flex justify-center mb-8">
          <img
            src="/lovable-uploads/799139f6-aba6-44d5-a4ae-b414f5437f2d.png"
            alt="ZenoScale Logo"
            className="h-20 w-20 md:h-24 md:w-24 animate-fade-in"
          />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 animate-fade-in">
          <span className="bg-gradient-to-r from-zenopurple to-zenoblue bg-clip-text text-transparent">
            MetalScale
          </span>{" "}
          <span className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            de Alto Rendimiento
          </span>
        </h1>
        
        <p className={`text-lg md:text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-3xl mx-auto animate-fade-in`}>
          Servidores bare metal especializados con tecnología propia de automatización,
          escalabilidad total y atención humana con mentalidad técnica.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
          <Link to="/planes">
            <Button className="btn-gradient text-lg px-6 md:px-8 py-5 md:py-6">Ver Planes</Button>
          </Link>
          <Link to="/contacto">
            <Button variant="outline" className="text-lg px-6 md:px-8 py-5 md:py-6">Contactar</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
