
import { Server, Shield, Cpu } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Cpu className="h-12 w-12 text-zenopurple" />,
      title: "Alto Rendimiento",
      description: "Servidores dedicados optimizados para aplicaciones críticas con virtualización eficiente"
    },
    {
      icon: <Server className="h-12 w-12 text-zenoblue" />,
      title: "Escalabilidad Total",
      description: "Flexibilidad para aumentar recursos según tus necesidades sin complicaciones técnicas"
    },
    {
      icon: <Shield className="h-12 w-12 text-green-500" />,
      title: "Seguridad Garantizada",
      description: "Protección DDoS, backups diarios y 99.9% de uptime garantizado para tu tranquilidad"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card-gradient p-8 flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-gray-50 p-4 inline-block">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
