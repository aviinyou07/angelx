"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "../components/footer";
import { useRouter } from "next/navigation";

export default function DemoPage() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setHistory(data.history || []);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  return (
    <div>
      <main>
        <div className="page-wrappers empty-page">
          <div className="page-wrapperss page-wrapper-ex page-wrapper-login page-wrapper-loginacc form-wrapper">
            <div className="brdc">
              <div className="back-btn">
                <Link href="/home">
                  <img src="images/back-btn.png" alt="Back" />
                </Link>
              </div>
              <h3>Exchange History</h3>
            </div>

            <section className="section-1">
              {loading ? (
                <p style={{ fontSize: "14px", textAlign: "center" }}>
                  Loading...
                </p>
              ) : history.length === 0 ? (
                <div className="image">
                  <img src="images/empty.jpg" alt="No History" />
                  <p style={{ fontSize: "14px", textAlign: "center" }}>
                    No transactions found
                  </p>
                </div>
              ) : (
                <div className="history-list">
                  {history.map((tx) => (
                    <div key={tx.id} className="history-card">
                      <div className="row">
                        <span className="label">Type:</span>
                        <span className="value">{tx.type}</span>
                      </div>
                      <div className="row">
                        <span className="label">Amount:</span>
                        <span className="value">${tx.amount.toFixed(2)}</span>
                      </div>
                      <div className="row">
                        <span className="label">Status:</span>
                        <span className="value">{tx.status}</span>
                      </div>
                      <div className="row">
                        <span className="label">Date:</span>
                        <span className="value">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        <Footer />
      </main>

      <style jsx>{`
        .page-wrappers {
          min-height: 100vh;
          overflow-y: auto; /* ✅ allows vertical scrolling */
          -webkit-overflow-scrolling: touch; /* smooth scroll on iOS */
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 12px; /* some breathing room */
          width: 100%;
        }

        .history-card {
          width: 100%;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 12px;
          background: #fff;
          font-size: 13px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
        }

        .label {
          font-weight: 500;
          color: #666;
          font-size: 12px;
        }

        .value {
          font-weight: 600;
          font-size: 13px;
          color: #111;
        }
      `}</style>
    </div>
  );
}
