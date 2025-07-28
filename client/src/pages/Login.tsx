import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';
import blueBg from '../assets/blue-bg.png';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../assets/logo.png'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      login(response.token, response.user);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
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
      setError(error.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed');
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex lg:flex-row flex-col">
      <div className="flex flex-col justify-center w-full md:w-1/2 px-8 md:px-16 lg:px-24 py-12 bg-white">
        <div className="text-3xl font-bold text-blue-600 mb-2 lg:absolute lg:top-8 lg:left-8 lg:mb-0">
          <img src={logo}/>
        </div>
        <h2 className="pt-20 text-3xl font-bold text-gray-800 mb-1">Sign in</h2>
        <p className="text-sm text-gray-500 mb-6">Please login to continue to your account.</p>

        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

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
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <div className="hidden lg:block flex-1 relative">
        <img src={blueBg} alt="Blue background" className="relative w-full h-full bg-gradient-to-broverflow-hidden" />
      </div>
    </div>
  );
};

export default Login;
