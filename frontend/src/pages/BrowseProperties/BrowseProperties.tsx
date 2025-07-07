import { useEffect, useState } from 'react';
import { PropertyResponse } from '../../types/dtos/PropertyResponse.dto';
import IconComponent from '../../components/GeneralComponents/IconComponent';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import PropertyCard from '../../components/PropertyComponents/PropertyCard';
import AdComponent from '../../components/GeneralComponents/AdComponent';
import { BiDollar } from 'react-icons/bi';
import { BrowseState } from '../../types/BrowseStates';
import InspectSingleProperty from '../../components/PropertyComponents/InspectSingleProperty';
import Button from '../../components/GeneralComponents/Button';
import { IoArrowBack } from 'react-icons/io5';

const BrowseProperties = () => {
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [browseState, setbrowseState] = useState<BrowseState>('browseMany');
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyResponse | null>(null);

  const pageSize = 6;

  const fetchProperties = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/property/getPropertiesByPage?page=${page}&pageSize=6`,
      );
      const data = await response.json();
      if (response.ok && data.properties) {
        setTotalPages(Math.ceil(data.totalCount / pageSize));
        setProperties(data.properties);
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to fetch properties. Please try again.');
      }
    } catch {
      setErrorMessage('Failed to fetch properties. Please try again.');
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

  // Map fetched and add pagination with controls
  const propertyListWithPagination = (
    <div>
      {/* Mapping property results into property cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {properties.map((property: PropertyResponse) => {
          return (
            <button
              key={property.id}
              className='hover:cursor-pointer'
              onClick={() => {
                setSelectedProperty(property);
                setbrowseState('inspectSingle');
              }}
            >
              <PropertyCard
                key={property.id}
                imageUrl={`data:image/jpeg;base64,${property.coverPicture}`}
                propertyType={property.propertyType}
                beds={property.bedrooms ?? 0}
                baths={property.bathrooms ?? 0}
                street={
                  property.street ?? `${property.street}, ${property.city}`
                }
                formattedPrice={`${property.price.toLocaleString('fr-FR')} €`}
              />
            </button>
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

        {totalPages > 1 && page !== totalPages && (
          <>
            <span>
              Showing page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className='flex items-center gap-1 px-3 py-1 bg-sky-200 rounded-md hover:cursor-pointer hover:bg-sky-300 transition duration-200'
            >
              <p className='m-0 text-md'>Next</p>
              <IconComponent icon={FaAngleRight} size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className='m-10'>
        {loading && <p>Loading properties...</p>}
        {errorMessage !== '' && <p className='text-red-500'>{errorMessage}</p>}

        {/* Render single inspect component or paginated list according to browseState */}
        {browseState === 'browseMany' ? (
          propertyListWithPagination
        ) : selectedProperty ? (
          <InspectSingleProperty
            onClick={() => setbrowseState('browseMany')}
            property={selectedProperty}
          />
        ) : (
          <div className='flex flex-col gap-4 items-center justify-center'>
            <Button
              onClick={() => setbrowseState('browseMany')}
              text='Back to browsing'
              icon={IoArrowBack}
              iconSize={18}
            />
            <p>No property selected. Please try again.</p>
          </div>
        )}
      </div>
      <AdComponent
        title='Mortgage Masters'
        message='Short on liquid assets? Mortgage Masters can solve your problems!'
        buttonText='Apply for loan'
        icon={BiDollar}
        addToClassName='mt-20 mx-auto'
      />
    </>
  );
};

export default BrowseProperties;
