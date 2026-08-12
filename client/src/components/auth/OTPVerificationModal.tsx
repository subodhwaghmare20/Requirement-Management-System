import React, { useState, useEffect, useRef } from 'react';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { Mail, CheckCircle2, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { AuthResponse } from '../../types';

interface OTPVerificationModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (response: AuthResponse) => void;
  initialDevOtp?: string;
}

export const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  email,
  isOpen,
  onClose,
  onSuccess,
  initialDevOtp,
}) => {
  const { showToast } = useToast();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [devOtp, setDevOtp] = useState<string | undefined>(initialDevOtp);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialDevOtp) {
      setDevOtp(initialDevOtp);
    }
  }, [initialDevOtp]);

  // Countdown timer for OTP Resend
  useEffect(() => {
    if (!isOpen) return;
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const newDigits = pasted.split('');
      setDigits(newDigits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpCode = digits.join('');
    if (otpCode.length !== 6) {
      showToast('Please enter all 6 digits of the OTP code', 'error');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await authService.verifyOtp(email, otpCode);
      showToast('Email verified successfully!', 'success');
      onSuccess(res);
    } catch (err: any) {
      showToast(err.message || 'Invalid or expired OTP code', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      const res = await authService.sendOtp(email);
      showToast(res.message, 'info');
      setCountdown(60);
      if (res.devOtp) {
        setDevOtp(res.devOtp);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to resend OTP', 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200/80 p-6 space-y-5 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Verify Your Email</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 text-xs text-slate-600">
          <p>
            We have generated a 6-digit verification code for <span className="font-semibold text-slate-900">{email}</span>.
          </p>

          {devOtp && (
            <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-900 font-medium">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Verification OTP Code:</span>
              </div>
              <span className="text-base font-bold tracking-widest text-indigo-700 font-mono bg-white px-2.5 py-1 rounded border border-indigo-200 shadow-2xs">
                {devOtp}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleVerify} className="space-y-5">
          {/* 6 Digit Input Boxes */}
          <div className="flex items-center justify-center gap-2">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className="w-10 h-12 text-center text-lg font-bold rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            ))}
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" isLoading={isVerifying}>
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify & Complete Login</span>
          </Button>
        </form>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
          <span className="text-slate-500">Didn't receive email?</span>
          <button
            type="button"
            disabled={countdown > 0 || isResending}
            onClick={handleResend}
            className="text-indigo-600 font-semibold hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
            <span>{countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
