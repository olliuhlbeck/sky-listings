import { useEffect, useState } from 'react';
import { PropertyResponse } from '../../types/dtos/PropertyResponse.dto';
import IconComponent from '../../components/GeneralComponents/IconComponent';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import PropertyCard from '../../components/PropertyComponents/PropertyCard';

const BrowseProperties = () => {
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const itemsPerPage = 6;

  const fetchProperties = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/property/getPropertiesByPage?page=${page}&pageSize=6`,
      );
      const data = await response.json();
      if (response.ok && data.properties) {
        setTotalPages(Math.ceil(data.totalCount / itemsPerPage));
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
    <div className='m-10'>
      {loading && <p>Loading...</p>}
      {errorMessage !== '' && <p className='text-red-500'>{errorMessage}</p>}

      {/* Mapping property results into property cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {properties.map((property: PropertyResponse) => {
          return (
            <PropertyCard
              key={property.id}
              imageUrl={`data:image/jpeg;base64,${property.coverPicture}`}
              beds={property.bedrooms ?? 0}
              baths={property.bathrooms ?? 0}
              street={property.street ?? `${property.street}, ${property.city}`}
              formattedPrice={`${property.price.toLocaleString('fr-FR')} €`}
            />
          );
        })}
      </div>

      {/* Pagination section */}
      <div className='flex gap-6 items-center justify-center mt-4'>
        {page !== 1 && (
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className='flex items-center gap-1 px-3 py-1 bg-sky-200 rounded-md hover:cursor-pointer hover:bg-sky-300 transition duration-200'
          >
            <IconComponent icon={FaAngleLeft} size={16} />
            <p>Previous</p>
          </button>
        )}

        <span>
          Showing page {page} of {totalPages}
        </span>

        {totalPages > 1 && page !== totalPages && (
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className='flex items-center gap-1 px-3 py-1 bg-sky-200 rounded-md hover:cursor-pointer hover:bg-sky-300 transition duration-200'
          >
            <p className='m-0 text-md'>Next</p>
            <IconComponent icon={FaAngleRight} size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BrowseProperties;
