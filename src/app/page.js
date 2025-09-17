import Image from "next/image";
import styles from "./page.module.css";
import Index from ".";
{/*import Exchange from "./exchange/page";
import USDTDeposit from "./USDT-deposit/page";
import AddBank from "./add-bank/page";
import AddBankCard from "./bind-bank-card/page";
import LoginPage from "./pages/login";
import LoginAccount from "./login-account/page";
import CompleteProfile from "./complete-profile/page";
import HomePage from "./home/page"; 
import DemoPage from "./blank-page/page";
import DepositAmount from "./deposit-amount/page";*/}


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Index/>
        {/*<Exchange/>
        <USDTDeposit/>
        <AddBank/>
        <AddBankCard/>
        <LoginPage/>
        <LoginAccount/>
        <CompleteProfile/>
        <HomePage/>
        <DemoPage/>
        <DepositAmount/>*/}
      </main>    
    </div>
  );
}
