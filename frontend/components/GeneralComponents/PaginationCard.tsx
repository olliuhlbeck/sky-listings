import React from 'react';
import { useEffect, useState } from 'react';
import IconComponent from '../GeneralComponents/IconComponent';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { ProductDto } from '../../types/dtos/ProductDto';

const PaginationCard: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const pageSize = 5;

  const fetchProducts = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch('https://dummyjson.com/products?limit=25');
      const data = await res.json();
      if (res.ok && data.products) {
        const newProducts: string[] = data.products.map(
          (product: ProductDto) => product.title,
        );
        setProducts(newProducts);
      }
    } catch {
      setErrorMessage('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / pageSize);

  const selectPageHandler = (selectedPage: number) => {
    setPage(selectedPage);
  };

  const setPreviouspage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const setNextpage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <>
      <div className='rounded-lg bg-gray-50 w-4/6 h-fit-content shadow-md shadow-gray-500 p-4 flex flex-col items-center'>
        {errorMessage !== '' ? (
          <p className='text-red-500 font-semibold'>{errorMessage}</p>
        ) : (
          ''
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          products.length > 0 && (
            <ul className='list-disc list-outside w-1/3'>
              {products
                .slice(page * pageSize - pageSize, page * pageSize)
                .map((title: string) => {
                  return (
                    <li key={title} className='p-1'>
                      {title}
                    </li>
                  );
                })}
            </ul>
          )
        )}
        {products.length > 0 && (
          <div className='text-blue-300 flex items-center justify-center'>
            {page > 1 && (
              <span onClick={() => setPreviouspage()}>
                <IconComponent
                  icon={FaAngleLeft}
                  className=' hover:bg-blue-300 hover:text-slate-900 hover:rounded-full p-2 cursor-pointer font-semibold'
                  size={32}
                />
              </span>
            )}
            {Array.from(
              { length: Math.ceil(products.length / pageSize) },
              (_, index) => {
                return (
                  <span
                    onClick={() => selectPageHandler(index + 1)}
                    key={index}
                    className={`cursor-pointer m-2 px-3 py-1 hover:bg-blue-300 hover:text-slate-900 hover:rounded-full font-semibold ${page === index + 1 ? 'text-blue-900 underline' : ''}`}
                  >
                    {index + 1}
                  </span>
                );
              },
            )}
            {page < totalPages && (
              <span onClick={() => setNextpage()}>
                <IconComponent
                  icon={FaAngleRight}
                  className=' hover:bg-blue-300 hover:text-slate-900 hover:rounded-full p-2 cursor-pointer font-semibold'
                  size={32}
                />
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PaginationCard;
