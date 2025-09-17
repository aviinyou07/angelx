'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginAccount() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const otpInputRef = useRef(null);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ✅ Auth guard: redirect already logged-in users
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.replace('/home');
  }, [router]);

  // Auto-hide messages
  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError('');
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, message]);

  // Load saved email + OTP cooldown
  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) setEmail(savedEmail);

    const expiry = localStorage.getItem('otpCooldownExpiry');
    if (expiry) {
      const remaining = Math.floor((+expiry - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
        setOtpSent(true);
      }
    }
  }, []);

  // Save email in localStorage
  useEffect(() => {
    if (email) localStorage.setItem('email', email);
  }, [email]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      localStorage.removeItem('otpCooldownExpiry');
    }
  }, [cooldown]);

  const handleSendOtp = async () => {
    if (!email) return setError('Please enter your email');
    if (!validateEmail(email.trim())) return setError('Please enter a valid email');

    setError('');
    setMessage('');
    setLoadingOtp(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setMessage('✅ OTP sent! Check your email.');
        otpInputRef.current?.focus();

        const expiry = Date.now() + 30 * 1000;
        localStorage.setItem('otpCooldownExpiry', expiry);
        setCooldown(30);
      } else {
        if (res.status === 401) router.replace('/login'); // auto redirect on unauthorized
        else setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!email || !otp) return setError('Please enter email and OTP');

    setError('');
    setMessage('');
    setLoadingVerify(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) localStorage.setItem('token', data.token);
        setMessage('🎉 OTP verified! Redirecting...');
        setTimeout(() => {
          window.location.href = data.redirectTo || '/home';
        }, 1500);
      } else {
        if (res.status === 401) router.replace('/login'); // auto redirect on unauthorized
        else setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div>
      <main>
        <div className="page-wrappers">
          <div className="page-wrapperss page-wrapper-ex page-wrapper-login page-wrapper-loginacc form-wrapper">
            <div className="back-btn">
              <Link href="/login">
                <img src="images/back-btn.png" />
              </Link>
            </div>
            <section className="section-1">
              <h3 className="title">
                <b>Welcome to AngleX</b>
              </h3>
              <p>
                AngelX is the most trustable and exchange partner, the more you
                exchange, the more you earn!
              </p>

              <div className="form-bx">
                <div className="form-rw">
                  <label className="text">Email Address</label>
                  <input
                    type="text"
                    id="emailadd"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-rw">
                  <label className="text">OTP</label>
                  <div className="pos">
                    <input
                      type="text"
                      id="otp"
                      placeholder="Enter Your OTP"
                      value={otp}
                      ref={otpInputRef}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loadingOtp || cooldown > 0}
                    >
                      {loadingOtp
                        ? 'Sending...'
                        : cooldown > 0
                          ? `Resend in ${cooldown}s`
                          : otpSent
                            ? 'Resend OTP'
                            : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                {message && <p style={{ color: 'green', marginBottom: '10px' }}>{message}</p>}

                <button
                  type="button"
                  className="login-btn"
                  onClick={handleVerifyOtp}
                  disabled={!otpSent || loadingVerify}
                >
                  {loadingVerify ? 'Verifying...' : 'Sign Up / Login'}
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
