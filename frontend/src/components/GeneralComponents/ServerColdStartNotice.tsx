import { useEffect, useState } from 'react';
import Button from './Button';
import { IoClose } from 'react-icons/io5';

const STORAGE_KEY = 'serverColdStartNoticeShown';
const AUTO_DISMISS_TIME_MS = 45_000;

const ServerColdStartNotice = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasBeenShown = localStorage.getItem(STORAGE_KEY);

    if (hasBeenShown === 'true') {
      return;
    }

    setVisible(true);

    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, 'true');
      setVisible(false);
    }, AUTO_DISMISS_TIME_MS);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className='fixed flex flex-col gap-2 top-4 left-1/2 transform -translate-x-1/2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 shadow-lg max-w-md w-[calc(100%-2rem)] z-50'>
      <Button
        icon={IoClose}
        iconSize={20}
        onClick={handleDismiss}
        ClassName='absolute top-2 right-2 !p-1 !bg-transparent hover:!bg-sky-200 dark:hover:!bg-slate-700'
        aria-label='Dismiss notice'
      />
      <p className=''>Waking up the server.</p>
      <p>
        First connection to backend may take 30-60 seconds since backend is
        hosted on Render free plan.
      </p>
      <p className=''>Thank you for your patience!</p>
    </div>
  );
};

export default ServerColdStartNotice;
