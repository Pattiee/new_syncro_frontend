import React from 'react';

// Define the structural data contract for individual address records
export interface AddressDetails {
  city: string;
  zip: string | number;
  country: string;
}

// Define the incoming props contract for the component wrapper
export interface ShippingAddressProps {
  address: AddressDetails | null | undefined;
}

export const ShippingAddress: React.FC<ShippingAddressProps> = ({ address }) => {
  if (!address) return null;

  const { city, zip, country } = address;

  return (
    <div>
      <div>
        <span className='text-lg font-bold text-gray-900 dark:text-white'>Shipping Address</span>
      </div>

      {/* Info Breakdown Tray */}
      <div className='flex flex-col text-sm text-gray-700 dark:text-gray-300 mt-2 space-y-1'>
        {/* Zip code */}
        <div>
          <span className="font-semibold">Zip:</span> <span>{zip}</span>
        </div>

        {/* City */}
        <div>
          <span className="font-semibold">City:</span> <span>{city}</span>
        </div>

        {/* Country */}
        <div>
          <span className="font-semibold">Country:</span> <span>{country}</span>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress;