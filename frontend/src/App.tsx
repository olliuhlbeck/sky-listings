import './App.css';
import { Outlet } from 'react-router-dom';
import HeaderContainer from '../components/HeaderComponents/HeaderContainer';
import background from './assets/background.jpg';

function App() {
  return (
    <div
      className='w-full min-h-screen text-center font-mono bg-cover bg-center'
      style={{ backgroundImage: `url(${background})` }}
    >
      <HeaderContainer title='Coding practice' link='home' />
      <main className='pt-18 h-80'>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
