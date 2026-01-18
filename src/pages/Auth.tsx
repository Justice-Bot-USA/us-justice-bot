import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { trackSignUp, trackSignupCompleted, getDetectedCountry } from '@/hooks/useAnalytics';
import { AlertCircle, Check } from 'lucide-react';

const signUpSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must be less than 72 characters'),
  firstName: z.string().trim().max(50, 'First name must be less than 50 characters').optional(),
  lastName: z.string().trim().max(50, 'Last name must be less than 50 characters').optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

const signInSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

interface FieldError {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  acceptTerms?: string;
}

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    acceptTerms: false,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      // Redirect to case analysis (triage) after login/signup
      navigate('/case-analysis', { replace: true });
    }
  }, [user, loading, navigate]);

  // Clear errors when switching between sign in and sign up
  useEffect(() => {
    setFieldErrors({});
    setFormData(prev => ({ ...prev, acceptTerms: false }));
  }, [isSignUp]);

  const validateField = (field: string, value: any): string | undefined => {
    try {
      if (isSignUp) {
        const partialSchema = signUpSchema.pick({ [field]: true } as any);
        partialSchema.parse({ [field]: value });
      } else {
        const partialSchema = signInSchema.pick({ [field]: true } as any);
        partialSchema.parse({ [field]: value });
      }
      return undefined;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message;
      }
      return undefined;
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (fieldErrors[field as keyof FieldError]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    const value = formData[field as keyof typeof formData];
    const error = validateField(field, value);
    if (error) {
      setFieldErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      // Validate all fields
      const schema = isSignUp ? signUpSchema : signInSchema;
      const dataToValidate = isSignUp 
        ? formData 
        : { email: formData.email, password: formData.password };
      
      const validatedData = schema.parse(dataToValidate);

      if (isSignUp) {
        const { error } = await signUp(validatedData.email, validatedData.password);
        
        if (error) {
          // Handle specific Supabase errors
          if (error.message.includes('already registered') || error.message.includes('already exists')) {
            setFieldErrors({ email: 'This email is already registered. Please sign in instead.' });
          } else if (error.message.includes('invalid email')) {
            setFieldErrors({ email: 'Please enter a valid email address' });
          } else if (error.message.includes('password')) {
            setFieldErrors({ password: error.message });
          } else {
            toast({
              title: "Sign Up Error",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          // 🔥 GA4 signup_completed conversion event (CA/US parity)
          trackSignupCompleted('email', getDetectedCountry());
          setSignupSuccess(true);
          
          // Show success briefly then redirect
          toast({
            title: "Account Created!",
            description: "Redirecting you to get started...",
          });
          
          // Redirect happens automatically via useEffect when user state updates
        }
      } else {
        const { error } = await signIn(validatedData.email, validatedData.password);
        
        if (error) {
          // Handle specific Supabase errors
          if (error.message.includes('Invalid login credentials')) {
            setFieldErrors({ 
              email: ' ',
              password: 'Invalid email or password. Please try again.' 
            });
          } else if (error.message.includes('Email not confirmed')) {
            setFieldErrors({ email: 'Please check your email and confirm your account first.' });
          } else {
            toast({
              title: "Sign In Error",
              description: error.message,
              variant: "destructive",
            });
          }
        }
        // Redirect happens automatically via useEffect when user state updates
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: FieldError = {};
        error.issues.forEach(issue => {
          const field = issue.path[0] as keyof FieldError;
          if (!errors[field]) {
            errors[field] = issue.message;
          }
        });
        setFieldErrors(errors);
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/case-analysis" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? 'Sign up for your US Justice Bot account'
              : 'Sign in to your US Justice Bot account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                    placeholder="John"
                    className={fieldErrors.firstName ? 'border-destructive' : ''}
                    aria-invalid={!!fieldErrors.firstName}
                    aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
                  />
                  {fieldErrors.firstName && (
                    <p id="firstName-error" className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    onBlur={() => handleBlur('lastName')}
                    placeholder="Doe"
                    className={fieldErrors.lastName ? 'border-destructive' : ''}
                    aria-invalid={!!fieldErrors.lastName}
                    aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
                  />
                  {fieldErrors.lastName && (
                    <p id="lastName-error" className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="john@example.com"
                required
                autoComplete="email"
                className={fieldErrors.email && fieldErrors.email !== ' ' ? 'border-destructive' : ''}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              />
              {fieldErrors.email && fieldErrors.email !== ' ' && (
                <p id="email-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.email}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                required
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className={fieldErrors.password ? 'border-destructive' : ''}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              />
              {fieldErrors.password && (
                <p id="password-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.password}
                </p>
              )}
              {isSignUp && !fieldErrors.password && (
                <p className="text-xs text-muted-foreground">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange('acceptTerms', !!checked)}
                    className={fieldErrors.acceptTerms ? 'border-destructive' : ''}
                    aria-invalid={!!fieldErrors.acceptTerms}
                    aria-describedby={fieldErrors.acceptTerms ? 'terms-error' : undefined}
                  />
                  <Label 
                    htmlFor="acceptTerms" 
                    className="text-sm leading-tight cursor-pointer"
                  >
                    I agree to the{' '}
                    <a href="/terms" className="text-primary underline" target="_blank">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary underline" target="_blank">
                      Privacy Policy
                    </a>
                    <span className="text-destructive"> *</span>
                  </Label>
                </div>
                {fieldErrors.acceptTerms && (
                  <p id="terms-error" className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.acceptTerms}
                  </p>
                )}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                : (isSignUp ? 'Create Account' : 'Sign In')
              }
            </Button>

            {signupSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md">
                <Check className="h-4 w-4" />
                Account created! Redirecting...
              </div>
            )}
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp 
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;