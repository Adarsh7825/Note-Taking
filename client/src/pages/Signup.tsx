import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';
import blueBg from '../assets/blue-bg.png';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png'

const Signup: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.sendOTP(email, name);
      setStep('otp');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.verifyOTPAndSignup({ email, name, password, otp });
      login(response.token, response.user);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.googleAuth({ credential: credentialResponse.credential });
      login(response.token, response.user);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google signup failed');
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row">
      <div className="flex flex-col justify-center h-full w-full md:w-1/2 px-8 md:px-16 lg:px-24 py-12 bg-white">
      <div className="text-3xl font-bold text-blue-600 mb-2 lg:absolute lg:top-8 lg:left-8 lg:mb-0">
          <img src={logo}/>
        </div>
        <h2 className="pt-20 text-2xl font-semibold text-gray-800 mb-1">Sign up</h2>
        <p className="text-sm text-gray-500 mb-6">Sign up to get started</p>

        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>}

        {step === 'email' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Create a password"
                  className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="mb-2">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="100%"
            useOneTap
          />
        </div>


        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="hidden lg:block flex-1 relative">
        <img src={blueBg} alt="Blue background" className="relative w-full h-full bg-gradient-to-broverflow-hidden" />
      </div>
    </div>
  );
};

export default Signup;
