import React from 'react';
import { FooterProps } from '../../types/FooterProps';
import IconComponent from '../GeneralComponents/IconComponent';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { FaPhone } from 'react-icons/fa6';
import { MdAlternateEmail } from 'react-icons/md';

const Footer: React.FC<FooterProps> = ({ footerVisible, setFooterVisible }) => {
  return (
    <footer
      className={`bg-sky-200 sticky bottom-0 ${footerVisible ? 'w-full px-4 md:px-16 lg:px-28 py-4' : 'ml-auto mr-2 w-20 h-16 rounded-t-md'} `}
    >
      <button
        className='absolute top-2 right-4 hover:text-slate-100 hover:cursor-pointer transition pr-3 py-3'
        onClick={() => setFooterVisible(!footerVisible)}
      >
        {footerVisible ? (
          <IconComponent icon={IoIosArrowDown} size={23} />
        ) : (
          <IconComponent icon={IoIosArrowUp} size={23} />
        )}
      </button>
      {footerVisible && (
        <>
          <div className='grid grid-cols-1 md:grid-cols-5'>
            <div className='md:col-start-2  text-center'>
              <h3 className='text-lg font-bold mb-4'>TS & Tailwind</h3>
              <p className=' mb-4'>Responsive React footer component</p>
            </div>
            <div className='text-center'>
              <h3 className='text-lg font-bold mb-4'>Quick links</h3>
              <ul>
                <li className='hover:cursor-pointer hover:underline '>
                  References
                </li>
                <li className='hover:cursor-pointer hover:underline '>
                  Services
                </li>
                <li className='hover:cursor-pointer hover:underline  mb-4'>
                  About
                </li>
              </ul>
            </div>
            <div className='text-center'>
              <h3 className='text-lg font-bold mb-4'>Contacts</h3>
              <ul className='flex flex-col space-y-3 justify-center items-center'>
                <li className='flex gap-2 hover:underline '>
                  <IconComponent icon={FaPhone} />
                  <a href='' className='hover:underline '>
                    +358 40 123 1231
                  </a>
                </li>
                <li className='flex gap-2 hover:underline '>
                  <IconComponent icon={MdAlternateEmail} />
                  <a href='' className='hover:underline '>
                    feedback@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-t text-center pt-4'>
            <p>© 2025 My coding pracs. All rights reserved.</p>
          </div>
        </>
      )}
    </footer>
  );
};

export default Footer;
