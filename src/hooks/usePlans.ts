
import { useState, useEffect } from 'react';
import { Plan } from '@/types/plan';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/plans');
      setPlans(response.data);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('No se pudieron cargar los planes');
      toast.error('Error al cargar los planes');
    } finally {
      setLoading(false);
    }
  };

  const addPlan = async (planData: Omit<Plan, 'id'>) => {
    try {
      const response = await api.post('/plans', planData);
      setPlans([...plans, response.data]);
      toast.success('Plan añadido correctamente');
      return response.data;
    } catch (err) {
      console.error('Error adding plan:', err);
      toast.error('Error al añadir el plan');
      throw err;
    }
  };

  const updatePlan = async (id: number, planData: Omit<Plan, 'id'>) => {
    try {
      const response = await api.put(`/plans/${id}`, planData);
      setPlans(plans.map(plan => plan.id === id ? response.data : plan));
      toast.success('Plan actualizado correctamente');
      return response.data;
    } catch (err) {
      console.error('Error updating plan:', err);
      toast.error('Error al actualizar el plan');
      throw err;
    }
  };

  const deletePlan = async (id: number) => {
    try {
      await api.delete(`/plans/${id}`);
      setPlans(plans.filter(plan => plan.id !== id));
      toast.success('Plan eliminado correctamente');
    } catch (err) {
      console.error('Error deleting plan:', err);
      toast.error('Error al eliminar el plan');
      throw err;
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    loading,
    error,
    fetchPlans,
    addPlan,
    updatePlan,
    deletePlan
  };
};
