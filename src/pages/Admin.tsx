
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, Check, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlanCard from "@/components/PlanCard";
import PlanForm from "@/components/PlanForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { usePlans } from "@/hooks/usePlans";
import { Plan } from "@/types/plan";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import axios from "axios";

const Admin = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { plans, loading: plansLoading, addPlan, updatePlan, deletePlan } = usePlans();
  
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<number | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Database connection status
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [dbError, setDbError] = useState<string | null>(null);
  const [isCheckingDb, setIsCheckingDb] = useState(false);
  
  useEffect(() => {
    document.title = "Panel Admin - MetalScale";
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    setIsCheckingDb(true);
    setDbStatus('checking');
    setDbError(null);
    
    try {
      const response = await axios.get('/api/auth/check-db-connection');
      if (response.data.connected) {
        setDbStatus('connected');
      } else {
        setDbStatus('error');
        setDbError(response.data.error || 'No se pudo conectar a la base de datos');
      }
    } catch (error) {
      setDbStatus('error');
      setDbError('Error al verificar la conexión con la base de datos');
      console.error('Error checking database connection:', error);
    } finally {
      setIsCheckingDb(false);
    }
  };

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
              <TabsTrigger value="database">Base de Datos</TabsTrigger>
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
            
            <TabsContent value="database">
              <div>
                <h2 className="text-2xl font-bold mb-4">Estado de la Base de Datos</h2>
                
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Database className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Conexión a MySQL</h3>
                      <p className="text-sm text-gray-600">
                        Estado de la conexión a la base de datos
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-medium">Estado:</span>
                    {dbStatus === 'checking' ? (
                      <span className="text-yellow-500 flex items-center">
                        Comprobando...
                      </span>
                    ) : dbStatus === 'connected' ? (
                      <span className="text-green-500 flex items-center">
                        <Check className="h-5 w-5 mr-1" /> Conectado
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center">
                        <X className="h-5 w-5 mr-1" /> Error de conexión
                      </span>
                    )}
                  </div>
                  
                  {dbError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{dbError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    onClick={checkDatabaseConnection} 
                    disabled={isCheckingDb} 
                    className="w-full"
                  >
                    {isCheckingDb ? 'Comprobando...' : 'Comprobar Conexión'}
                  </Button>
                </div>
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
