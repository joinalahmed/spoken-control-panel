
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded credentials
  const VALID_EMAIL = 'thomas@gmail.com';
  const VALID_PASSWORD = 'password123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        onLogin();
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">Dhwani</span>
          </div>
          <p className="text-gray-600 text-sm">Voice AI Agents Playground</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600">Welcome back! Please enter your details.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="thomas@gmail.com"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button
                    type="button"
                    className="text-purple-600 hover:text-purple-500"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-500 font-medium"
                >
                  Sign Up
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
              By logging into the platform, you are agreeing to the{' '}
              <button className="text-purple-600 hover:underline">Terms of Service</button>,{' '}
              <button className="text-purple-600 hover:underline">Privacy Policy</button>,{' '}
              and our{' '}
              <button className="text-purple-600 hover:underline">Security Policy</button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="text-gray-700 text-sm">
            <div className="font-medium mb-2">Demo Credentials:</div>
            <div>Email: thomas@gmail.com</div>
            <div>Password: password123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
