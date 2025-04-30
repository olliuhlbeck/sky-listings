import './App.css';
import { Outlet } from 'react-router-dom';
import HeaderContainer from '../components/HeaderComponents/HeaderContainer';
import background from './assets/background.jpg';
import { useState } from 'react';
import Footer from '../components/FooterComponents/Footer';

function App() {
  const [footerVisible, setFooterVisible] = useState<boolean>(true);
  return (
    <div
      className='flex flex-col w-full min-h-screen text-center font-mono bg-cover bg-center text-slate-900'
      style={{ backgroundImage: `url(${background})` }}
    >
      <HeaderContainer title='Coding practice' link='home' />
      <main className='flex-grow pt-18'>
        <Outlet />
      </main>
      <Footer
        footerVisible={footerVisible}
        setFooterVisible={setFooterVisible}
      />
    </div>
  );
}

export default App;
