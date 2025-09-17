'use client'
import React, { useState, useEffect } from 'react';


import Slider from 'react-slick';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function Exchange() {

  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const settings = {
    dots: false,
    arrows: false,
    autoplay: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: false,
  };

  const settings1 = {
    vertical: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3500,
    speed: 800,
    infinite: true,
    pauseOnHover: false,
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) return null;

  return (
    <div>
      <main>
        <div className="page-wrappers">

          <header className="header">
            <div className="left">
              <img src="images/w-logo.jpg" />
            </div>
            <div className="right">
              <img src="images/customer-care.png" />
            </div>
          </header>

          <div className="page-wrapper page-wrapper-ex">
            <section className="section-1">
              <Slider {...settings}>
                <div><img src="/images/ex-sl1.png" alt="Slide 1" style={{ 'width': '100%', 'borderRadius': '10px' }} /></div>
                <div><img src="/images/ex-sl2.png" alt="Slide 2" style={{ 'width': '100%', 'borderRadius': '10px' }} /></div>

              </Slider>

            </section>

            <section className="section-3">
              <p className="title" style={{ textAlign: 'left' }}><b>Platform Price</b></p>
              <div className="price-calc">
                <div className="priceref">
                  <p>Automatic refress after <span className="ref"><span id="tmId">52</span>s</span></p>
                </div>
                <div className="reff-price">
                  <div className="base-price">
                    <h4>99 <span>Base</span></h4>
                  </div>
                  <p className="onepriceex">1 USDT = &#8377;99</p>

                  <div className="pricerefBx">
                    <table width="100%">
                      <thead>
                        <tr>
                          <th>Exchanges($)</th>
                          <th>Prices(&#8377;)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>&gt;=1041 and &lt;2000</td>
                          <td>99+ <span className="red">0.50</span></td>
                        </tr>
                        <tr>
                          <td>&gt;=1041 and &lt;2000</td>
                          <td>99+ <span className="red">0.50</span></td>
                        </tr>
                        <tr>
                          <td>&gt;=1041 and &lt;2000</td>
                          <td>99+ <span className="red">0.50</span></td>
                        </tr>
                        <tr>
                          <td>&gt;=5.1041</td>
                          <td>99+ <span className="red">0.50</span></td>
                        </tr>
                        <tr>
                          <td colSpan="2"><a href="#">What is tiered price policy?</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="login-bx">
                  <Link
                    href={isLoggedIn ? "/sell-usdt" : "/login"}
                    className="login-btn"
                  >
                    {isLoggedIn ? "Sell USDT" : "Login for sell USDT"}
                  </Link>

                  {!isLoggedIn && (
                    <p className="text">
                      First time login will register new account for you
                    </p>
                  )}
                </div>
                <div className="deposit">
                  <div className="bx">
                    <Link href="/USDT-deposit">
                      <div className="icon"><img src="images/card.png" /></div>
                      <p>Deposit</p>
                    </Link>
                  </div>

                  <div className="bx">
                    <Link href="/sell-usdt">
                      <div className="icon"><img src="images/trans-money.png" /></div>
                      <p>Withdraw</p>
                    </Link>
                  </div>

                  <div className="bx">
                    <Link href="#">
                      <div className="icon"><img src="images/envlope.png" /></div>
                      <p>Invite</p>
                    </Link>
                  </div>
                </div>

                <div className="notify">
                  <div className="lefts">
                    <div className="icon"><img src="images/notify.png" /></div>
                    <div className="spr">|</div>
                    <Slider {...settings1} className='text-sl'>
                      <p className="text"><span className="time">12:34</span> 84***4556 solid for $756</p>
                      <p className="text"><span className="time">10:55</span> 84***6744 solid for $897</p>
                    </Slider>
                  </div>
                  <div className="rights">
                    <div className="icon right"><img src="images/right-arw.png" /></div>
                  </div>
                </div>
              </div>

            </section>


            <section className="section-4">
              <p className="title" style={{ textAlign: "left" }}>
                <b>Exchanges Price</b>
              </p>
              <div className="dflex-out">
                <div className="bx">
                  <div className="dflex">
                    <img src="images/wazirx.png" />{" "}
                    <Link href="/exchange">
                      <img src="images/grn-right-arw.png" />
                    </Link>
                  </div>
                  <div className="text">
                    Avg <span className="b">88.1</span> <span className="rs">RS</span>
                  </div>
                  <div className="small">1USDT = ₹88.1</div>
                  <div className="rw">
                    Min <span className="black">88RS</span>
                  </div>
                  <div className="rw">
                    Max <span className="black">88.35RS</span>
                  </div>
                </div>
                <div className="bx">
                  <div className="dflex">
                    <img src="images/binance.png" />{" "}
                    <Link href="/exchange">
                      <img src="images/grn-right-arw.png" />
                    </Link>
                  </div>
                  <div className="text">
                    Avg <span className="b">91.88</span> <span className="rs">RS</span>
                  </div>
                  <div className="small">1USDT = ₹99.88</div>
                  <div className="rw">
                    Min <span className="black">91.46RS</span>
                  </div>
                  <div className="rw">
                    Max <span className="black">92.20RS</span>
                  </div>
                </div>
              </div>
              <p className="title btm" style={{}}>
                Statistics based on the latest 10 pieces of data
              </p>
            </section>
            <section className="section-2">
              <p className="title" style={{ textAlign: "left" }}>
                <b>Platform Advantage</b>
              </p>
              <div className="rw">
                <div className="bx">
                  <div className="image">
                    <img src="images/mic.png" style={{}} />{" "}
                    <h3>
                      <span className="fontt">24/7</span> Support
                    </h3>
                  </div>
                  <div className="info">
                    <p>
                      Got a problem? Just get in touch. Our customer service support team
                      is available 24/7.
                    </p>
                  </div>
                </div>
                <div className="bx">
                  <div className="image">
                    <img src="images/card.png" style={{}} /> <h3>Transaction Free</h3>
                  </div>
                  <div className="info">
                    <p>
                      Use a variety of payment methods to trade cryptocurrency, free, safe
                      and fast.
                    </p>
                  </div>
                </div>
                <div className="bx">
                  <div className="image">
                    <img src="images/money.png" style={{}} /> <h3>Rich Information</h3>
                  </div>
                  <div className="info">
                    <p>
                      Gather a wealth of information, let you know the industry dynamics
                      in first time.
                    </p>
                  </div>
                </div>
                <div className="bx">
                  <div className="image">
                    <img src="images/Pro.png" style={{}} /> <h3>Reliable Security</h3>
                  </div>
                  <div className="info">
                    <p>
                      Our sophisticated security measures protect your cryptocurrency from
                      all risks.
                    </p>
                  </div>
                </div>
              </div>
            </section>


          </div>





        </div>
      </main>
    </div>
  );
}
