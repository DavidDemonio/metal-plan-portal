
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "ZenoScale - Bare Metal Hosting";
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* New section: Server status */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Monitorizamos 24/7</h2>
              <p className="text-gray-600">Estado operativo de nuestros centros de datos</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { location: "Madrid", status: "Operativo", color: "bg-green-500" },
                { location: "Barcelona", status: "Operativo", color: "bg-green-500" },
                { location: "Lisboa", status: "Mantenimiento", color: "bg-yellow-500" },
                { location: "París", status: "Operativo", color: "bg-green-500" }
              ].map((datacenter, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{datacenter.location}</span>
                    <span className={`h-3 w-3 ${datacenter.color} rounded-full`}></span>
                  </div>
                  <p className="text-sm text-gray-500">{datacenter.status}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <Features />
        
        {/* New section: Call to action */}
        <section className="py-16 px-4 bg-gradient-to-br from-zenopurple-light to-zenoblue-light">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">¿Listo para escalar?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Únete a las empresas que confían en nuestros servicios para sus infraestructuras críticas
            </p>
            <Link to="/planes" className="inline-block">
              <Button className="bg-white text-zenopurple hover:bg-gray-100 text-lg px-8 py-6">
                Comienza Ahora
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

function Link(props) {
  return <a {...props}>{props.children}</a>;
}
