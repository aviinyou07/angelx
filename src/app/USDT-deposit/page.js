'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function USDTDeposit() {
  const [activeTab, setActiveTab] = useState('TRC20');
  const [amount, setAmount] = useState('');
   const [walletBalance, setWalletBalance] = useState(0); // <-- add this

  // Fetch wallet balance on mount
  useEffect(() => {
    const fetchWallet = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('/api/wallet', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setWalletBalance(data.usdtAvailable || 0);
        } else if (res.status === 401) {
          window.location.href = '/login'; // redirect if unauthorized
        }
      } catch (err) {
        console.error('Failed to fetch wallet:', err);
      }
    };

    fetchWallet();
  }, []);

  return (
    <div>
      <main>
        <div className="page-wrappers no-empty-page">

          <header className="header">
            <div className="brdc">
              <div className="back-btn">
                <Link href="/exchange">
                  <img src="images/back-btn.png" />
                </Link>
              </div>
              <h3>Deposit USDT</h3>
            </div>
            <div className="right">
              <img src="images/undo.png" />
            </div>
          </header>

          <div className="page-wrapperss">
            <section className="section-1">
              <div className="bnr">
                <img src="images/top-bnr.png" style={{ width: "100%", float: "left" }} />
              </div>
              <div className="btmbnr">
                <img src="images/recharge-top-bg.png" style={{ width: "100%" }} />
              </div>
            </section>

            <section className="section-2 inner-space">
              <div className="inside">
                {/* NETWORK TABS */}
                <div className="top">
                  <p className="title">network</p>
                  <div className="select-tbs">
                    <div
                      className={`tb ${activeTab === 'TRC20' ? 'active' : ''}`}
                      onClick={() => setActiveTab('TRC20')}
                    >
                      <input
                        type="radio"
                        name="tab"
                        checked={activeTab === 'TRC20'}
                        onChange={() => setActiveTab('TRC20')}
                      />
                      <img src="images/tb-ic1.png" className="icon" /> TRC20
                      <img src="images/y-tick.png" className="y-icon" />
                    </div>

                    <div
                      className={`tb ${activeTab === 'ERC20' ? 'active' : ''}`}
                      onClick={() => setActiveTab('ERC20')}
                    >
                      <input
                        type="radio"
                        name="tab"
                        checked={activeTab === 'ERC20'}
                        onChange={() => setActiveTab('ERC20')}
                      />
                      <img src="images/tb-ic2.png" className="icon" /> ERC20
                      <img src="images/y-tick.png" className="y-icon" />
                    </div>
                  </div>
                </div>

                {/* AMOUNT INPUT */}
                <div className="btm">
                  <p className="title">Amount</p>
                  <div className="select-amt" style={{ position: "relative" }}>
                    <input
                      type="number"
                      placeholder="Please enter the amount"
                      name="amt"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={{
                        width: "100%",
                        paddingRight: "50px",
                        border: "none",
                        outline: "none",
                        fontSize: "12px",
                        color: "#111",
                        background: "transparent",
                        zIndex: 2,
                        position: "relative",
                      }}
                    />
                    <div
                      className="amt"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                    >
                      <img src="images/uic.png" className="icon" /> USDT
                    </div>

                    <style jsx>{`
                      input::-webkit-outer-spin-button,
                      input::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                      }
                      input[type="number"] {
                        -moz-appearance: textfield;
                      }
                      ::placeholder {
                        color: gray;
                        font-size: 12px;
                      }
                    `}</style>
                  </div>
                </div>

                {/* DEPOSIT BUTTON WITH QUERY PARAMS */}
                 <p className="title">Available($) {walletBalance}</p>
                <Link
                  href={{
                    pathname: "/deposit-amount",
                    query: { amount, network: activeTab },
                  }}
                  className="button-style"
                >
                  Deposit
                </Link>
              </div>
            </section>

            <div className="warning inner-space">
              <div className="inside">
                <img src="images/warn.png" className="icon" />
                For the safety of your funds, please note that the recharge address for each order is different. 
                Please double-check carefully to avoid the risk of irretrievable funds.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
