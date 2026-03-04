'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { AlertCircle, Clock, LogOut } from 'lucide-react';

interface InactivityWatcherProps {
  timeoutMinutes: number;
}

export default function InactivityWatcher({ timeoutMinutes }: InactivityWatcherProps) {
  const { data: session, status } = useSession();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minute warning
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    signOut({ callbackUrl: '/login?reason=inactivity' });
  }, []);

  const resetTimer = useCallback(() => {
    if (showWarning) return; // Don't reset if warning is already showing
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Set timer for (timeout - 2) minutes to show warning
    const warningTime = (timeoutMinutes * 60 - 120) * 1000;
    timerRef.current = setTimeout(() => {
      setShowWarning(true);
    }, Math.max(0, warningTime));
  }, [timeoutMinutes, showWarning]);

  const stayLoggedIn = () => {
    setShowWarning(false);
    setCountdown(120);
    resetTimer();
  };

  useEffect(() => {
    if (status !== 'authenticated') return;

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [status, resetTimer]);

  useEffect(() => {
    if (showWarning && countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (showWarning && countdown === 0) {
      logout();
    }
    
    return () => {
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [showWarning, countdown, logout]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-orange-500 p-6 text-white flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Session Security</h3>
            <p className="text-orange-100 text-sm">Inactive for too long</p>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <div className="mb-6">
            <p className="text-gray-600 mb-2">Your session will expire in</p>
            <div className="text-4xl font-black text-navy tabular-nums">
              {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={stayLoggedIn}
              className="w-full bg-teal hover:bg-teal/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-teal/20"
            >
              Stay Logged In
            </button>
            <button
              onClick={() => logout()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-6 rounded-xl transition-all"
            >
              Sign Out Now
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex items-center gap-3">
          <AlertCircle size={16} className="text-gray-400" />
          <p className="text-xs text-gray-400">
            For your security, we automatically sign out inactive sessions.
          </p>
        </div>
      </div>
    </div>
  );
}
