import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Calendar } from 'lucide-react';
import logo from '../assets/logo.png';
import blueBg from '../assets/wall.png';

const FloatingLabelInput = React.memo(({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  maxLength,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  disabled = false,
  id,
  ...props 
}: any) => {
  return (
    <div className="relative mb-6">
      <input
        id={id}
        type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
        value={value || ''}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        disabled={disabled}
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer disabled:bg-gray-50 disabled:text-gray-500"
        placeholder=" "
        autoComplete="off"
        {...props}
      />
      <label 
        htmlFor={id}
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {label}
      </label>
      
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 z-20"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
      
      {type === 'date' && (
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-20" size={20} />
      )}
    </div>
  );
});

const AuthForm: React.FC = () => {
  const location = useLocation();
  const isSignup = useMemo(() => location.pathname.includes('signup'), [location.pathname]);
  const [formState, setFormState] = useState({
    step: 'email' as 'email' | 'otp',
    email: '',
    name: '',
    password: '',
    dateOfBirth: '',
    otp: '',
    error: '',
    loading: false,
    showPassword: false,
    resendLoading: false,
    resendTimer: 0
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  // Update form state helper
  const updateFormState = useCallback((updates: Partial<typeof formState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  // Stable input handlers
  const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormState({ [field]: e.target.value });
  }, [updateFormState]);

  // Create stable handlers
  const handlers = useMemo(() => ({
    name: handleInputChange('name'),
    email: handleInputChange('email'),
    password: handleInputChange('password'),
    dateOfBirth: handleInputChange('dateOfBirth'),
    otp: handleInputChange('otp')
  }), [handleInputChange]);

  // Timer for resend OTP
  React.useEffect(() => {
    if (formState.resendTimer > 0) {
      const timer = setTimeout(() => 
        updateFormState({ resendTimer: formState.resendTimer - 1 }), 1000
      );
      return () => clearTimeout(timer);
    }
  }, [formState.resendTimer, updateFormState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateFormState({ error: '', loading: true });

    try {
      if (isSignup) {
        if (formState.step === 'email') {
          await authAPI.sendOTP(formState.email, formState.name);
          updateFormState({ step: 'otp', resendTimer: 60 });
        } else {
          const res = await authAPI.verifyOTPAndSignup({ 
            email: formState.email, 
            name: formState.name, 
            password: formState.password, 
            dateOfBirth: formState.dateOfBirth, 
            otp: formState.otp 
          });
          login(res.token, res.user);
          navigate('/dashboard');
        }
      } else {
        const res = await authAPI.login({ 
          email: formState.email, 
          password: formState.password 
        });
        login(res.token, res.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      updateFormState({ error: err.response?.data?.message || 'Authentication failed' });
    } finally {
      updateFormState({ loading: false });
    }
  };

  const handleResendOTP = async () => {
    if (formState.resendTimer > 0) return;
    
    updateFormState({ error: '', resendLoading: true });
    
    try {
      await authAPI.sendOTP(formState.email, formState.name);
      updateFormState({ resendTimer: 60 });
    } catch (err: any) {
      updateFormState({ error: err.response?.data?.message || 'Failed to resend OTP' });
    } finally {
      updateFormState({ resendLoading: false });
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    updateFormState({ error: '', loading: true });
    try {
      const res = await authAPI.googleAuth({ credential: credentialResponse.credential });
      login(res.token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      updateFormState({ error: err.response?.data?.message || 'Google login failed' });
    } finally {
      updateFormState({ loading: false });
    }
  };

  const togglePassword = useCallback(() => {
    updateFormState({ showPassword: !formState.showPassword });
  }, [formState.showPassword, updateFormState]);

  return (
    <div className="h-screen w-screen overflow-hidden flex lg:flex-row flex-col">
      <div className="flex flex-col justify-center w-full md:w-1/2 px-8 md:px-16 lg:px-24 py-12 bg-white">
        <div className="text-3xl font-bold text-blue-600 mb-2 lg:absolute lg:top-8 lg:left-8">
          <img src={logo} alt="Logo" />
        </div>

        <h2 className="pt-20 text-3xl font-bold text-gray-800 mb-1">
          {isSignup ? 'Sign up' : 'Sign in'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {isSignup ? 'Sign up to enjoy the feature of HD' : 'Please login to continue to your account.'}
        </p>

        {formState.error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {formState.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          {isSignup && formState.step === 'email' && (
            <>
              <FloatingLabelInput
                id="name_input"
                label="Your Name"
                type="text"
                value={formState.name}
                onChange={handlers.name}
                required
              />
              
              <FloatingLabelInput
                id="dob_input"
                label="Date of Birth"
                type="date"
                value={formState.dateOfBirth}
                onChange={handlers.dateOfBirth}
                required
              />
            </>
          )}

          <FloatingLabelInput
            id="email_input"
            label="Email"
            type="email"
            value={formState.email}
            onChange={handlers.email}
            required
            disabled={isSignup && formState.step === 'otp'}
          />

          {(isSignup && formState.step === 'otp') || !isSignup ? (
            <>
              {isSignup && (
                <div className="space-y-4">
                  <FloatingLabelInput
                    id="otp_input"
                    label="Enter OTP"
                    type="text"
                    value={formState.otp}
                    onChange={handlers.otp}
                    maxLength={6}
                    required
                  />
                  
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={formState.resendTimer > 0 || formState.resendLoading}
                      className={`text-sm font-medium transition-colors ${
                        formState.resendTimer > 0 || formState.resendLoading
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:text-blue-700 cursor-pointer'
                      }`}
                    >
                      {formState.resendLoading 
                        ? 'Sending...' 
                        : formState.resendTimer > 0 
                          ? `Resend OTP in ${formState.resendTimer}s` 
                          : 'Resend OTP'
                      }
                    </button>
                  </div>
                </div>
              )}

              <FloatingLabelInput
                id="password_input"
                label="Password"
                value={formState.password}
                onChange={handlers.password}
                required
                showPasswordToggle
                showPassword={formState.showPassword}
                onTogglePassword={togglePassword}
              />
            </>
          ) : null}

          <div className="pt-4">
            <button
              type="submit"
              disabled={formState.loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition duration-200"
            >
              {formState.loading
                ? isSignup
                  ? formState.step === 'email'
                    ? 'Sending OTP...'
                    : 'Creating Account...'
                  : 'Signing in...'
                : isSignup
                ? formState.step === 'email'
                  ? 'Send OTP'
                  : 'Create Account'
                : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="mb-6">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={() => updateFormState({ error: 'Google login failed' })} 
            useOneTap 
          />
        </div>

        <p className="text-center text-sm text-gray-600">
          {isSignup ? 'Already have an account?' : `Don't have an account?`}{' '}
          <Link to={isSignup ? '/login' : '/signup'} className="text-blue-600 hover:underline font-medium">
            {isSignup ? 'Sign in' : 'Sign up'}
          </Link>
        </p>
      </div>

      <div className="hidden lg:block flex-1 relative">
        <img 
          src={blueBg} 
          alt="Blue background" 
          className="w-full h-full object-cover rounded-l-3xl" 
        />
      </div>
    </div>
  );
};

export default AuthForm;