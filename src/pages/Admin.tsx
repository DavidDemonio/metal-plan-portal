
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlanCard from "@/components/PlanCard";
import PlanForm from "@/components/PlanForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { usePlans } from "@/hooks/usePlans";
import { Plan } from "@/types/plan";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Admin = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { plans, loading: plansLoading, addPlan, updatePlan, deletePlan } = usePlans();
  
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<number | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  useEffect(() => {
    document.title = "Panel Admin - MetalScale";
  }, []);

  // Si no está autenticado y ya terminó de cargar, redireccionar al login
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };
  
  const handleDeleteClick = (id: number) => {
    setDeletingPlanId(id);
  };
  
  const handleConfirmDelete = async () => {
    if (deletingPlanId) {
      try {
        await deletePlan(deletingPlanId);
      } catch (error) {
        console.error("Error al eliminar plan:", error);
      } finally {
        setDeletingPlanId(null);
      }
    }
  };
  
  const handleFormSubmit = async (planData: Omit<Plan, 'id'>) => {
    setFormSubmitting(true);
    try {
      if (editingPlan) {
        await updatePlan(editingPlan.id, planData);
      } else {
        await addPlan(planData);
      }
      setShowForm(false);
      setEditingPlan(null);
    } catch (error) {
      console.error("Error al guardar plan:", error);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingPlan(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
          
          <Tabs defaultValue="plans">
            <TabsList className="mb-8">
              <TabsTrigger value="plans">Planes</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>
            
            <TabsContent value="plans" className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestión de Planes</h2>
                <Button onClick={() => setShowForm(true)} className="btn-gradient">
                  Añadir Plan
                </Button>
              </div>
              
              {showForm ? (
                <div className="mt-6">
                  <PlanForm 
                    plan={editingPlan || undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                    loading={formSubmitting}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                  {plansLoading ? (
                    <p>Cargando planes...</p>
                  ) : plans.length === 0 ? (
                    <p>No hay planes disponibles. ¡Añade tu primer plan!</p>
                  ) : (
                    plans.map(plan => (
                      <PlanCard 
                        key={plan.id} 
                        plan={plan} 
                        isAdmin={true}
                        onEdit={() => handleEditPlan(plan)}
                        onDelete={() => handleDeleteClick(plan.id)}
                      />
                    ))
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings">
              <div>
                <h2 className="text-2xl font-bold mb-4">Configuración del Sistema</h2>
                <p className="text-gray-600">
                  La configuración del sistema estará disponible próximamente.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <AlertDialog open={!!deletingPlanId} onOpenChange={() => setDeletingPlanId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. El plan será eliminado permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
