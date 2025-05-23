const AddProperty = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
    <form
      id='addPropertyForm'
      onSubmit={handleSubmit}
      className='bg-gray-50  w-11/12 justify-center mt-6 p-4 mx-auto rounded-lg shadow-md shadow-gray-500'
    >
      <h1 className='text-2xl font-semibold text-center mb-6'>
        Fill property information
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 [&>*]:flex-1 [&>*]:shadow-md [&>*]:rounded-md [&>*]:bg-gray-100 [&_h2]:text-xl [&_h2]:my-2 [&>*]:h-[15rem] mb-4'>
        <div>
          <h2>Address</h2>
          <div>street</div>
          <div>city</div>
          <div>city</div>
          <div>state</div>
          <div>postal code</div>
          <div>country</div>
        </div>

        <div>
          <h2>Property details</h2>
          <div>price</div>
          <div>property type</div>
          <div>property status</div>
        </div>

        <div>
          <h2>Basic info</h2>
          <div>bedrooms</div>
          <div>bathrooms</div>
          <div>square meters</div>
        </div>

        <div>
          <h2>Description</h2>
        </div>

        <div>
          <h2>Additional info</h2>
        </div>

        <div>
          <h2>Pictures</h2>
        </div>
      </div>
      <div className='col-span-full flex justify-center !bg-gray-50 !shadow-none !h-10'>
        <button className='bg-sky-200 text-slate-900 px-6 py-2 rounded-md shadow-md hover:bg-sky-300'>
          Submit property
        </button>
      </div>
    </form>
  );
};

export default AddProperty;
