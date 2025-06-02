import { useEffect, useState } from 'react';
import { PropertyResponse } from '../../types/dtos/PropertyResponse.dto';

const BrowseProperties = () => {
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchProperties = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/property/getPropertiesByPage?page=${page}&pageSize=6`,
      );
      const data = await response.json();
      if (response.ok && data.properties) {
        setTotalPages(data.totalCount);
        setProperties(data.properties);
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to fetch properties. Please try again.');
      }
    } catch {
      setErrorMessage('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page]);

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(1, prevPage - 1));
  };

  return (
    <div className='m-6'>
      <h2 className='text-xl'>Properties</h2>

      {loading && <p>Loading...</p>}
      {errorMessage !== '' && <p className='text-red-500'>{errorMessage}</p>}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {properties.map((property: PropertyResponse) => {
          return (
            <div key={property.id} className='bg-gray-50 p-2 rounded-lg shadow'>
              {property.coverPicture && (
                <img
                  src={`data:image/jpeg;base64,${property.coverPicture}`}
                  alt='Cover'
                  className='w-full h-40 object-cover rounded'
                />
              )}
              <p className='mt-2 font-semibold'>
                {property.postalCode !== undefined && `${property.postalCode},`}
                {property.street}
              </p>
              <p className='mt-2 font-semibold'>
                {property.postalCode} {property.city}, {property.country}
              </p>
            </div>
          );
        })}
      </div>

      <div className='flex justify-between items-center mt-4'>
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className='px-3 py-1 bg-sky-300 rounded disabled:opacity-50'
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className='px-3 py-1 bg-sky-300 rounded disabled:opacity-50'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BrowseProperties;
