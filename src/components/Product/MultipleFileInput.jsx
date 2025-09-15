import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const MultipleFileInput = ({ name }) => {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: {onChange, onBlur}, fieldState: {  error} }) => (
                <div>
                    <input type="file"
                    multiple
                    accept="image/*"
                    onBlur={onBlur}
                    onChange={(e) => {
                        const files = Array.from(e.target.files);
                        onChange(files);
                    }}
                    className="input-field bg-orange-600" />
                    {error && <span className='text-red-500 text-sm mt-1'>{error.message}</span>}
                </div>
            )}
        />
    )
}

export default MultipleFileInput