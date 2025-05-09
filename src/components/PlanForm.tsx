
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Plan } from "@/types/plan";

interface PlanFormProps {
  plan?: Plan;
  onSubmit: (plan: Omit<Plan, 'id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const PlanForm = ({ plan, onSubmit, onCancel, loading = false }: PlanFormProps) => {
  const [formData, setFormData] = useState<Omit<Plan, 'id'>>({
    name: "",
    price: 0,
    cpu: 0,
    ram: 0,
    storage: 0,
    backups: 0,
    description: "",
    features: []
  });
  
  const [featureInput, setFeatureInput] = useState("");
  
  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        price: plan.price,
        cpu: plan.cpu,
        ram: plan.ram,
        storage: plan.storage,
        backups: plan.backups,
        description: plan.description,
        features: plan.features || []
      });
    }
  }, [plan]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "cpu" || name === "ram" || name === "storage" || name === "backups" 
        ? parseFloat(value) 
        : value
    }));
  };
  
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan ? "Editar Plan" : "Nuevo Plan"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre del Plan
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Precio (€/mes)
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="cpu" className="text-sm font-medium">
                CPU (vCores)
              </label>
              <Input
                id="cpu"
                name="cpu"
                type="number"
                value={formData.cpu}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="ram" className="text-sm font-medium">
                RAM (MB)
              </label>
              <Input
                id="ram"
                name="ram"
                type="number"
                value={formData.ram}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="storage" className="text-sm font-medium">
                Almacenamiento (GB)
              </label>
              <Input
                id="storage"
                name="storage"
                type="number"
                value={formData.storage}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="backups" className="text-sm font-medium">
                Copias de Seguridad
              </label>
              <Input
                id="backups"
                name="backups"
                type="number"
                value={formData.backups}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descripción
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Características</label>
            
            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Añadir característica"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={handleAddFeature}
              >
                Añadir
              </Button>
            </div>
            
            {formData.features?.length ? (
              <ul className="space-y-2 mt-2">
                {formData.features.map((feature, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span>{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      ×
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          
          <CardFooter className="flex justify-end gap-2 px-0">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="btn-gradient">
              {loading ? "Guardando..." : "Guardar Plan"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlanForm;
