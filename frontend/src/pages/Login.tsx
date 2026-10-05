import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-md shadow-sm p-8 border border-slate-300 dark:border-slate-800">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-md bg-[#0B3B60] text-white flex items-center justify-center font-bold text-2xl border border-[#082b47]">
            <span className="text-amber-300 font-serif">स</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wide">
            MSME Sahayak AI
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Government of India • Ministry of Micro, Small & Medium Enterprises
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-md bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm transition"
              placeholder="entrepreneur@msme.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 text-sm shadow-sm"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-200 dark:border-slate-800 pt-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register">
              <span className="text-blue-700 dark:text-blue-400 font-semibold hover:underline">
                Register here
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
