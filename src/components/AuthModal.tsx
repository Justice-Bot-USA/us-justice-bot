import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'es';
}

export function AuthModal({ isOpen, onClose, language }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  const text = {
    en: {
      signIn: "Sign In",
      signUp: "Sign Up",
      email: "Email",
      password: "Password",
      signInButton: "Sign In",
      signUpButton: "Create Account",
      signInSuccess: "Successfully signed in!",
      signUpSuccess: "Account created! Please check your email to verify.",
      forgot: "Forgot password?",
      resetSent: "Password reset email sent.",
      error: "An error occurred. Please try again."
    },
    es: {
      signIn: "Iniciar Sesión",
      signUp: "Registrarse",
      email: "Correo Electrónico",
      password: "Contraseña",
      signInButton: "Iniciar Sesión",
      signUpButton: "Crear Cuenta",
      signInSuccess: "¡Sesión iniciada exitosamente!",
      signUpSuccess: "¡Cuenta creada! Por favor revisa tu correo para verificar.",
      forgot: "¿Olvidaste tu contraseña?",
      resetSent: "Correo de restablecimiento enviado.",
      error: "Ocurrió un error. Por favor intenta de nuevo."
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: text[language].error,
        variant: "destructive",
      });
      return;
    }

    setResetLoading(true);
    const { error } = await resetPassword(email);
    if (error) {
      toast({
        title: "Error",
        description: error.message ?? text[language].error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: text[language].resetSent,
      });
    }
    setResetLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Error",
        description: text[language].error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: text[language].signInSuccess
      });
      onClose();
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(email, password);
    
    if (error) {
      toast({
        title: "Error",
        description: text[language].error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: text[language].signUpSuccess
      });
      onClose();
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">A.I. ANAL</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{text[language].signIn}</TabsTrigger>
            <TabsTrigger value="signup">{text[language].signUp}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">{text[language].email}</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">{text[language].password}</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {text[language].signInButton}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full text-muted-foreground"
                disabled={resetLoading}
                onClick={handleForgotPassword}
              >
                {resetLoading ? "Sending…" : text[language].forgot}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">{text[language].email}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">{text[language].password}</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {text[language].signUpButton}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}