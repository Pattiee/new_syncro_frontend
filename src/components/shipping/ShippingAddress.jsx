import React from 'react'

export const ShippingAddress = ({ address }) => {
    const { city, zip, country } = address;
    return (
      <>
          {address && (
            <div>
                <div>
                    <span className='text-lg font-bold text-gray-900'>Shipping Address</span>
                </div>

                {/* Info */}
                <div className='flex flex-col'>
                    {/* Zip code */}
                    <label htmlFor="zip">
                        Zip: <span>{ zip }</span>
                    </label>

                    {/* City */}
                    <label htmlFor="city">
                        City: <span>{ city }</span>
                    </label>

                    {/* Country */}
                    <label htmlFor="country">
                        Country: <span>{ country }</span>
                    </label>
                  </div>
              </div>
          )}
      </>
  )
}
