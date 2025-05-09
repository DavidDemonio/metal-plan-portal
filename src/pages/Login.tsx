
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    document.title = "Acceso Admin - MetalScale";
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
