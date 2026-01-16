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
import { IoArrowBack, IoClose, IoSearch } from 'react-icons/io5';
import formatPropertyType from '../../utils/formatPropertyTypes';
import { SearchConditions } from '../../types/searchConditions';
import { MdErrorOutline } from 'react-icons/md';
import { GetPropertiesResponse } from '../../types/dtos/GetPropertiesResponse.dto';
import { RiResetRightLine } from 'react-icons/ri';
import ServerColdStartNotice from '../../components/GeneralComponents/ServerColdStartNotice';

const BrowseProperties = () => {
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [browseState, setBrowseState] = useState<BrowseState>('browseMany');
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyResponse | null>(null);
  const [searchCondition, setSearchCondition] = useState<SearchConditions>(
    SearchConditions.Street,
  );
  const [searchTerm, setSearchTerm] = useState<string>('');

  const pageSize = 6;

  const fetchProperties = async (): Promise<void> => {
    setLoading(true);
    try {
      const BASE_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${BASE_URL}/property/getPropertiesByPage?page=${page}&pageSize=6&searchTerm=${searchTerm}&searchCondition=${searchCondition}`,
      );
      const data: GetPropertiesResponse = await response.json();
      if (response.ok && data.properties) {
        setTotalPages(Math.ceil(data.totalCount / pageSize));
        setProperties(data.properties);
        setErrorMessage(
          data.properties.length === 0 ? 'No properties found.' : '',
        );
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
      <div
        className={`grid grid-cols-1 ${properties.length === 1 ? '' : properties.length === 2 ? 'grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3'} gap-4`}
      >
        {properties.map((property: PropertyResponse) => {
          return (
            <button
              key={property.id}
              aria-label={`View details for ${property.street}, ${property.city}`}
              className={`hover:cursor-pointer ${properties.length === 1 ? 'lg:w-4/5 lg:mx-auto xl:w-3/5' : ''}`}
              onClick={() => {
                setSelectedProperty(property);
                setBrowseState('inspectSingle');
              }}
            >
              <PropertyCard
                imageUrl={`data:image/jpeg;base64,${property.coverPicture}`}
                propertyType={formatPropertyType(property.propertyType)}
                beds={property.bedrooms ?? 0}
                baths={property.bathrooms ?? 0}
                street={property.street}
                city={property.city}
                formattedPrice={`${property.price.toLocaleString('fr-FR')} €`}
              />
            </button>
          );
        })}
      </div>

      {/* Pagination section */}
      <nav
        className='flex gap-6 items-center justify-center mt-4'
        aria-label='Pagination'
      >
        {page !== 1 && (
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            aria-label={`Go to page ${page - 1}`}
            className='flex items-center gap-1 px-3 py-1 bg-sky-200 rounded-md hover:cursor-pointer hover:bg-sky-300 transition duration-200'
          >
            <IconComponent icon={FaAngleLeft} size={16} />
            <p>Previous</p>
          </button>
        )}

        {totalPages > 1 && (
          <>
            <span aria-live='polite'>
              Showing page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              aria-label={`Go to page ${page + 1}`}
              className='flex items-center gap-1 px-3 py-1 bg-sky-200 dark:bg-blue-900 rounded-md hover:cursor-pointer hover:bg-sky-300 dark:hover:bg-blue-700 transition duration-200'
            >
              <p className='m-0 text-md'>Next</p>
              <IconComponent icon={FaAngleRight} size={16} />
            </button>
          </>
        )}
      </nav>
    </div>
  );

  const handleClickSearch = () => {
    setPage(1);
    fetchProperties();
  };

  return (
    <>
      <ServerColdStartNotice />

      <main className='mx-10 mb-10'>
        {/* Search bar */}
        {browseState === 'browseMany' && (
          <div className='flex flex-col sm:flex-row bg-sky-200 dark:bg-slate-950 items-center justify-center w-11/12 sm:w-md min-w-56 max-w-lg gap-1 md:w-lg md:gap-7 sm:py-2 rounded-full mt-2 mb-3 shadow-sm mx-auto'>
            <div className='rounded-lg hover:bg-sky-300 dark:hover:bg-slate-800 lg:text-lg p-1'>
              <label htmlFor='searchCondition' className='sr-only'>
                Search condition
              </label>
              <select
                id='searchCondition'
                className='rounded-lg hover:cursor-pointer focus:underline focus:outline-none text-xs sm:text-md md:text-lg'
                value={searchCondition}
                onChange={(e) => {
                  const val = e.target.value as SearchConditions;
                  setSearchCondition(val);
                }}
              >
                {Object.values(SearchConditions).map((value) => (
                  <option
                    key={value}
                    value={value}
                    className='dark:text-slate-900'
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className='relative'>
              <label htmlFor='searchTerm' className='sr-only'>
                Search term
              </label>
              <input
                id='searchTerm'
                type='text'
                placeholder='Search properties...'
                className='bg-gray-50 text-center text-gray-700 rounded-lg focus:outline-none md:p-1'
                value={searchTerm ?? ''}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleClickSearch();
                  }
                }}
              />
              {searchTerm !== '' && (
                <button
                  type='button'
                  aria-label='clear term'
                  onClick={() => setSearchTerm('')}
                >
                  <IconComponent
                    icon={IoClose}
                    size={22}
                    className='absolute -right-2 top-0 transform -translate-y-1/2 cursor-pointer rounded-full  transition duration-150 text-slate-900 dark:text-slate-500 hover:text-red-400'
                  />
                </button>
              )}
            </div>
            <Button
              icon={IoSearch}
              iconSize={20}
              text='Search'
              ClassName='!p-1 focus:underline focus:outline-none dark:bg-transparent dark:hover:bg-slate-800'
              onClick={() => {
                handleClickSearch();
                setErrorMessage('');
              }}
            />
          </div>
        )}

        {/* Error display*/}
        {loading && (
          <div className='flex justify-center items-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
            <p className='ml-3 text-gray-600'>Loading properties...</p>
          </div>
        )}

        {errorMessage !== '' && (
          <div className='flex flex-col items-center gap-2 mt-5'>
            {/* Error text and icons */}
            <div className='flex gap-2 items-center'>
              <IconComponent icon={MdErrorOutline} className='text-red-500' />
              <p className='text-red-500'>{errorMessage}</p>
              <IconComponent icon={MdErrorOutline} className='text-red-500' />
            </div>
            {/* Retry button below error */}
            <Button
              text='Retry'
              onClick={() => {
                fetchProperties();
                setErrorMessage('');
              }}
              icon={RiResetRightLine}
              iconSize={16}
              ClassName='!bg-transparent !p-2 hover:!bg-sky-200 dark:hover:!bg-slate-800'
              aria-label='Retry fetching properties'
            />
          </div>
        )}

        {/* Render single inspect component or paginated list according to browseState */}
        {browseState === 'browseMany' ? (
          propertyListWithPagination
        ) : selectedProperty ? (
          <InspectSingleProperty
            onClick={() => setBrowseState('browseMany')}
            property={selectedProperty}
          />
        ) : (
          <div className='flex flex-col gap-4 items-center justify-center'>
            <Button
              onClick={() => setBrowseState('browseMany')}
              text='Back to browsing'
              icon={IoArrowBack}
              iconSize={18}
            />
            <p>No property selected. Please try again.</p>
          </div>
        )}
      </main>
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
