"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
   const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const options = { day: "numeric", month: "long" }; 
    setToday(now.toLocaleDateString("en-GB", options));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="page-wrappers">
        <div className="loader">
          <Image
            src="/images/loading.webp"
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
        <div className="page-wrappers page-wrapper-ex home-wrappers">
          <header className="header">
            <div className="left"></div>
            <div className="right">
              <img src="images/customer-care.png" />
            </div>
          </header>
          <div className="page-wrapper page-wrapper-ex">
            <section className="section-1">
              <div className="userpro">
                <div className="pic">
                  <img src="images/user-pic.png" />
                </div>
                <h3>{user?.mobile || "+91 ******"}</h3>
              </div>

              <div className="tab-inl">
                <div className="bx">
                  <p>Total Amount($)</p>
                  <h3>{(user?.wallet?.total || 0).toFixed(2)}</h3>
                </div>
                <div className="bx">
                  <p>Available($)</p>
                  <h3>{(user?.wallet?.available || 0).toFixed(2)}</h3>
                </div>
                <div className="bx">
                  <p>Progressing($)</p>
                  <h3>{(user?.wallet?.progressing || 0).toFixed(2)}</h3>
                </div>
              </div>
            </section>

            <section className="section-2a">
              <div className="inside">
                <div className="top">
                  <div className="lefts">
                    <div className="lf">
                      <img src="images/xicon.png" />
                    </div>
                    <div className="rf">
                      <p className="ttl">
                        <b>0 PAYX</b>
                      </p>
                      <p>
                        <span>1PAYX = 0.010750USDT</span>
                        <img src="images/ques.png" className="inq" />
                      </p>
                    </div>
                  </div>
                  <Link href="/sell-usdt">
                    <div className="rights">
                      <button className="btn">Withdraw</button>
                    </div>
                  </Link>
                </div>
                <div className="btm">
                  <button className="btn">To AngelX pro</button>
                </div>
              </div>
            </section>

            <section className="section-3">
              <div className="inside">
                <div className="lefts">
                  <p className="ttl">Exchange</p>
                  <p>
                    <b>$0</b>
                  </p>
                </div>
                <div className="mid">
                  <p className="ttl">
                    Reward <img src="images/xicon.png" />
                  </p>
                  <p>
                    <b>0</b>
                  </p>
                </div>
                <div className="rights">
                  <button className="btn">Details</button>
                   <p>{today}</p>
                </div>
              </div>
            </section>

            <section className="section-2 reffer">
              <div className="rw">
                <div className="bx">
                  <Link href="/referals">
                    <div className="image">
                      <h3>
                        <img src="images/ref-icon1.png" /> Referrals
                      </h3>
                    </div>
                    <div className="arw">
                      <img src="images/right-arw.png" />
                    </div>
                  </Link>
                </div>
                <div className="bx">
                  <Link href="/history">
                    <div className="image">
                      <h3>
                        <img src="images/ref-icon2.png" /> Exchange history
                      </h3>
                    </div>
                    <div className="arw">
                      <img src="images/right-arw.png" />
                    </div>
                  </Link>
                </div>
                <div className="bx">
                  <Link href="/statements">
                    <div className="image">
                      <h3>
                        <img src="images/ref-icon3.png" /> Statement
                      </h3>
                    </div>
                    <div className="arw">
                      <img src="images/right-arw.png" />
                    </div>
                  </Link>
                </div>
                <div className="bx">
                  <Link href="/bank">
                    <div className="image">
                      <h3>
                        <img src="images/ref-icon4.png" /> Bank account
                      </h3>
                    </div>
                    <div className="arw">
                      <img src="images/right-arw.png" />
                    </div>
                  </Link>
                </div>
                <div className="bx">
                  <Link href="/invite">
                    <div className="image">
                      <h3>
                        <img src="images/ref-icon5.png" /> Invited friends
                      </h3>
                    </div>
                    <div className="arw">
                      <img src="images/right-arw.png" />
                    </div>
                  </Link>
                </div>
              </div>

              <button className="button-style logout" onClick={handleLogout}>
                Logout
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
