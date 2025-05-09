
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlanCard from "@/components/PlanCard";
import { usePlans } from "@/hooks/usePlans";
import { Skeleton } from "@/components/ui/skeleton";

const Planes = () => {
  const { plans, loading, error } = usePlans();

  useEffect(() => {
    document.title = "Planes - MetalScale";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Nuestros Planes</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explora nuestras opciones y encuentra el plan que mejor se adapte a tus necesidades
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-gradient p-6">
                  <Skeleton className="h-8 w-1/3 mb-2" />
                  <Skeleton className="h-10 w-1/2 mb-6" />
                  <div className="space-y-4 mb-8">
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
              <p className="mt-2">Por favor, inténtalo de nuevo más tarde</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  isRecommended={index === 1} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Planes;
