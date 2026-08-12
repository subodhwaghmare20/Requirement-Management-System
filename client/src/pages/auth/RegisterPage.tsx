import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { OTPVerificationModal } from '../../components/auth/OTPVerificationModal';
import { ShieldAlert } from 'lucide-react';
import { AuthResponse } from '../../types';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { updateLocalUser, updateLocalProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // OTP Modal State
  const [otpModalOpen, setOtpModalOpen] = useState<boolean>(false);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const res = await authService.register(data);
      setPendingEmail(data.email);
      setDevOtp(res.devOtp);
      setOtpModalOpen(true);
      showToast('Registration initiated! Please verify the OTP sent to your email.', 'info');
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Please check your details.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSuccess = (authRes: AuthResponse) => {
    setOtpModalOpen(false);
    if (authRes.token) {
      localStorage.setItem('portal_token', authRes.token);
    }
    updateLocalUser(authRes.user);
    if (authRes.studentProfile) {
      updateLocalProfile(authRes.studentProfile);
    }
    showToast('Student account verified & logged in!', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50/70">
      <div className="w-full max-w-md space-y-6">
        <div className="card-surface p-6 sm:p-8 space-y-5">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-base mx-auto mb-3">
              EP
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Create Student Account
            </h1>
            <p className="text-xs text-slate-500">
              Register with your email to explore and apply for job drives
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Trainer & HR accounts are assigned by System Admin.</span>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" placeholder="Rahul Sharma" {...register('name')} error={errors.name?.message} />
            <Input label="Email Address" type="email" placeholder="student@institute.edu" {...register('email')} error={errors.email?.message} />
            <Input label="Phone Number" placeholder="+91 9876543210" {...register('phone')} />
            <Input label="Password" type="password" placeholder="At least 6 characters" {...register('password')} error={errors.password?.message} />

            <Button type="submit" variant="primary" fullWidth size="lg" isLoading={isSubmitting}>
              Send Verification OTP
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        email={pendingEmail}
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onSuccess={handleOtpSuccess}
        initialDevOtp={devOtp}
      />
    </div>
  );
};
