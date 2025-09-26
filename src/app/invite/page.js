'use client'
import React from 'react';

//import Image from "next/image";
import Link from 'next/link';
import Footer from '../components/footer';


export default function DemoPage() {
  
  return (
    <div>
      <main>
        <div className="page-wrappers empty-page">

  <div className="page-wrapperss page-wrapper-ex page-wrapper-login page-wrapper-loginacc form-wrapper" 
  style={{'height': '100%','overflow': 'auto','scrollbarWidth':'thin', 'scrollbarColor':'transparent transparent'}}>
    <div className="brdc">
      <div className="back-btn">
        <Link href="/home">
          <img src="images/back-btn.png" />
        </Link>
      </div>
      <h3>Invites
      </h3>
    </div>

    <section className="section-1s banner-imgn">
      <div className='informate'>
        <div className="full"><div className="info">
          <h3>Invite friends and make money together</h3>
          <p>Each accepted order of your subordinates will get you corresponding rewards</p></div></div>
      </div>
      <div className="image">
        <img src="images/inv-img.jpg" style={{"width":"100%"}} />
      </div>
    </section>
    <div className="pricerefBx pricerefBx-01">
      <h4><b>Rules</b></h4>
      <table width="100%">
          <thead>
            <tr>
                <th>Subordinate</th>
                <th>Commission</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td>1 Level</td>
                <td>0.1%</td>
            </tr>
            <tr>
                <td>2 Level</td>
                <td>0.03%</td>
            </tr>
            <tr>
                <td>3 Level</td>
                <td>0.02%</td>
            </tr>
            <tr>
                <td>4 Level</td>
                <td>0.01%</td>
            </tr>
            <tr>
                <td>5 Level</td>
                <td>0.01%</td>
            </tr>
          </tbody>
      </table>
    </div>

    <div className="login-bx" style={{"margin":"0 0 0 0"}}><a className="login-btn" href="/sell-usdt">Invite Friends</a></div>

  </div>
</div>

<Footer></Footer>

      </main>    
    </div>
  );
}
