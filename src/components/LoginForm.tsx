
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFirstTimeSetup } from "@/hooks/useFirstTimeSetup";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isFirstTime, register, registering } = useFirstTimeSetup();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(username, password);
      toast.success("Login exitoso");
      navigate("/admin");
    } catch (err) {
      setError("Error en las credenciales. Por favor, inténtalo de nuevo.");
      console.error("Error de login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    try {
      await register(username, password);
      toast.success("Cuenta de administrador creada correctamente");
      navigate("/admin");
    } catch (err) {
      setError("Error al crear la cuenta de administrador");
      console.error("Error de registro:", err);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {isFirstTime ? "Configuración Inicial" : "Acceso Admin"}
        </CardTitle>
        <CardDescription>
          {isFirstTime 
            ? "Crea tu cuenta de administrador para empezar" 
            : "Introduce tus credenciales para acceder al panel de administración"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={isFirstTime ? handleRegister : handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Usuario
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full btn-gradient" 
            disabled={loading || registering}
          >
            {isFirstTime 
              ? (registering ? "Creando cuenta..." : "Crear cuenta de administrador") 
              : (loading ? "Iniciando sesión..." : "Iniciar sesión")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
