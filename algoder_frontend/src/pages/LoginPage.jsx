import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import API from '../utils/api';
import Navbar from '../components/NavBar';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem('access_token');
    if (access) navigate('/');
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/login/', form);
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      localStorage.setItem('username', form.username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/[0.07] transition-colors";

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-neutral-900 flex items-center justify-center px-5 py-28 overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/[0.08] rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/[0.07] rounded-full blur-[120px]" />

        <div className="relative w-full max-w-md">
          <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl p-8 sm:p-10 overflow-hidden">
            {/* top glass shine */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Brand */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 bg-white/5 backdrop-blur-xl text-neutral-300 rounded-full text-xs font-medium border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300" />
                ALGODER
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                Welcome back
              </h1>
              <p className="text-neutral-400 text-sm">
                Log in to continue to your account
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-2.5 p-4 bg-red-500/10 border border-red-400/20 rounded-lg">
                <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-neutral-300 text-sm mb-2">Username</label>
                <input
                  name="username"
                  placeholder="Enter your username"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-neutral-300 text-sm mb-2">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    onChange={handleChange}
                    required
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 disabled:opacity-60 text-neutral-900 py-3.5 rounded-lg font-semibold transition-all duration-300 shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4" />
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <p className="mt-6 text-sm text-center text-neutral-500">
              Don't have an account?{' '}
              <Link to="/register/home/24354345/5443" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;