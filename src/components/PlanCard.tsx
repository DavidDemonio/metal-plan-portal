
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Plan } from "@/types/plan";

interface PlanCardProps {
  plan: Plan;
  isRecommended?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

const PlanCard = ({ 
  plan, 
  isRecommended = false,
  onEdit,
  onDelete,
  isAdmin = false
}: PlanCardProps) => {
  return (
    <div className={`card-gradient p-6 relative ${isRecommended ? 'border-2 border-zenopurple' : ''}`}>
      {isRecommended && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-zenoscale">
          Recomendado
        </Badge>
      )}
      
      <div className="text-lg font-bold mb-2">{plan.name}</div>
      
      <div className="flex items-end mb-6">
        <span className="text-3xl font-bold">{plan.price}€</span>
        <span className="text-gray-500">/mes</span>
      </div>
      
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500">CPU</div>
            <div className="font-medium">{plan.cpu} vCores</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500">RAM</div>
            <div className="font-medium">{plan.ram} MB</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500">Disco</div>
            <div className="font-medium">{plan.storage} GB</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500">Backups</div>
            <div className="font-medium">{plan.backups}</div>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">Descripción:</div>
          <p className="text-gray-600 text-sm">{plan.description}</p>
        </div>
        
        {plan.features && plan.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
      
      {isAdmin ? (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onEdit}>Editar</Button>
          <Button variant="destructive" onClick={onDelete}>Eliminar</Button>
        </div>
      ) : (
        <Button className="w-full btn-gradient">Contratar Servidor</Button>
      )}
    </div>
  );
};

export default PlanCard;
