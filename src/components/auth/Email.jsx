import React, { Fragment, useId } from 'react'

const Email = ({ value = '', onChange, confirmingPassword = false, errMessage }) => {
    const emailHintId = useId();


    return (
        <>
            <label htmlFor={emailHintId}>
                <p className='py-2 text-gray-300'> Email address </p>
                <input
                    type='email'
                    placeholder={'Enter email address'}
                    value={value}
                    onChange={onChange}
                    aria-describedby={emailHintId}
                    required
                    inputMode='email'
                    maxLength={50}
                    minLength={5}
                    autoComplete='username'
                    className='w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white autofill:bg-white autofill:text-black dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400'/>
            </label>
            <p
                id={emailHintId}
                className={`${confirmingPassword ? '' : 'text-red-500'}`} >
                { value && errMessage }
            </p>
        </>
    )
}

export default Email
