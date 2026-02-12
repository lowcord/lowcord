import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { db } from '../lib/database';
import type { Member } from '../App';
interface LoginScreenProps {
  onLogin: (user: Member) => void;
}
export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (isRegistering) {
      // Registration Logic
      const existingUser = db.findUserByEmail(email);
      if (existingUser) {
        setError('Email is already registered');
        return;
      }
      const newUser = {
        id: Date.now().toString(),
        username,
        discriminator: Math.floor(1000 + Math.random() * 9000).toString(),
        displayName: username,
        email,
        password,
        avatarColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
        status: 'online' as const,
        roles: [],
        joinedAt: new Date()
      };
      db.saveUser(newUser);
      onLogin(newUser);
    } else {
      // Login Logic
      const user = db.findUserByEmail(email);
      if (!user || user.password !== password) {
        setError('Invalid email or password');
        return;
      }
      onLogin(user);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#2f3136] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern
            id="pattern-circles"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse">

            <circle cx="20" cy="20" r="2" fill="#fff" />
          </pattern>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#pattern-circles)" />

        </svg>
      </div>

      <div className="w-full max-w-[784px] bg-[#36393f] rounded-[5px] shadow-2xl flex overflow-hidden z-10 transition-all duration-300">
        {/* Form Section */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isRegistering ? 'Create an account' : 'Welcome back!'}
            </h2>
            <p className="text-[#b9bbbe] text-[16px]">
              {isRegistering ?
              "We're so excited to see you join!" :
              "We're so excited to see you again!"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error &&
            <div className="bg-[#f04747] text-white text-sm p-2 rounded text-center font-medium">
                {error}
              </div>
            }

            <div>
              <label
                className={`block text-xs font-bold uppercase mb-2 ${error ? 'text-[#f04747]' : 'text-[#b9bbbe]'}`}>

                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#303339] border border-[#222428] rounded-[3px] p-2.5 text-[#dcddde] focus:outline-none focus:border-[#7289da] transition-colors" />

            </div>

            {isRegistering &&
            <div>
                <label className="block text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                  Username
                </label>
                <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#303339] border border-[#222428] rounded-[3px] p-2.5 text-[#dcddde] focus:outline-none focus:border-[#7289da] transition-colors" />

              </div>
            }

            <div>
              <label
                className={`block text-xs font-bold uppercase mb-2 ${error ? 'text-[#f04747]' : 'text-[#b9bbbe]'}`}>

                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#303339] border border-[#222428] rounded-[3px] p-2.5 text-[#dcddde] focus:outline-none focus:border-[#7289da] transition-colors" />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#b9bbbe] hover:text-[#dcddde]">

                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-xs text-[#b9bbbe] mt-1">
                Must be at least 8 characters.
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#7289da] hover:bg-[#677bc4] text-white font-medium py-3 rounded-[3px] transition-colors mt-4 mb-2">

              {isRegistering ? 'Continue' : 'Login'}
            </button>

            <div className="text-sm text-[#72767d]">
              {isRegistering ?
              <span>
                  <a
                  href="#"
                  className="text-[#7289da] hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsRegistering(false);
                    setError('');
                  }}>

                    Already have an account?
                  </a>
                </span> :

              <span>
                  Need an account?{' '}
                  <a
                  href="#"
                  className="text-[#7289da] hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsRegistering(true);
                    setError('');
                  }}>

                    Register
                  </a>
                </span>
              }
            </div>
          </form>
        </div>

        {/* QR Code Section (Visual Only) */}
        <div className="hidden md:flex w-[240px] bg-[#2f3136] flex-col items-center justify-center p-8 text-center">
          <div className="bg-white p-2 rounded mb-6">
            <div className="w-[140px] h-[140px] bg-white flex items-center justify-center">
              {/* Mock QR Code */}
              <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DiscordClone')] bg-contain bg-no-repeat" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Log in with QR Code
          </h3>
          <p className="text-[#b9bbbe] text-sm">
            Scan this with the{' '}
            <strong className="text-[#dcddde]">Discord mobile app</strong> to
            log in instantly.
          </p>
        </div>
      </div>
    </div>);

}