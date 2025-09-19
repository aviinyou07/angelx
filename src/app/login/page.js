'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      router.replace('/home'); // redirect if logged in
    } else {
      setLoading(false); // show login page if not
    }
  }, [router]);

  if (loading) {
    return (
      <div className="page-wrappers">
        <div className="loader">
          <Image
            src="/images/loading.webp" // ✅ Leading / ensures Vercel finds it
            alt="loader"
            width={50}
            height={50}
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <main>
        <div className="page-wrappers">
          <div className="page-wrapperss page-wrapper-ex page-wrapper-login">
            <section className="section-1">
              <div className="image">
                <img
                  src="/images/login-img.png" // ✅ Added leading /
                  style={{ width: "100%" }}
                  alt="Login Illustration"
                />
              </div>
            </section>
            <section className="section-3">
              <p className="title" style={{ textAlign: "center" }}>
                <b>Welcome to AngleX</b>
              </p>
              <p style={{ textAlign: "center" }}>
                AngelX is the most trustable and exchange partner, the more you
                exchange, the more you earn!
              </p>
              <div className="login-bx">
                <Link href="/login-account" className="login-btn">
                  Login
                </Link>
                <p className="text">
                  First time login will register new account for you
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
