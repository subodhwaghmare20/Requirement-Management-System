import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const user = await login(data);
      showToast(`Welcome back, ${user.name}!`, 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please verify your credentials.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoCredentials = (email: string, pass = 'password123') => {
    setValue('email', email);
    setValue('password', pass);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50/70">
      <div className="w-full max-w-md space-y-6">
        <div className="card-surface p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-base mx-auto mb-3">
              EP
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-slate-500">
              Access the External Job Opportunity Portal
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="student@institute.edu"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />

            <Button type="submit" variant="primary" fullWidth size="lg" isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>

          {/* Demo Presets */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block text-center">
              Quick Role Test Fill
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoCredentials('student@institute.edu')}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left font-medium"
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('trainer@institute.edu')}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left font-medium"
              >
                👨‍🏫 Trainer
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('hr@institute.edu')}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left font-medium"
              >
                🏢 HR Manager
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('admin@institute.edu')}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-left font-medium"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            Don't have a student account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
