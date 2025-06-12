import React, { useId } from 'react'

export const OneCharacterInput = ({ value = '', onChange, autofocus = true, disabled = true }) => {
    const charHintId = useId();
    
    return (
        <>
        <input
            type='text'
            value={value}
            disabled={disabled}
            onChange={onChange}
            aria-describedby={charHintId}
            required
            maxLength={1}
          inputMode='numeric'
          autoFocus={autofocus}
            autoComplete='one-time-code'
            className='flex items-center justify-center w-full p-1 text-black bg-white border border-gray-300 rounded-md sm:p-2 md:p-2 lg:p-2 xl:p-2 dark:bg-gray-700 dark:text-white autofill:bg-white autofill:text-black dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400'
          />
        </>
      );
}
