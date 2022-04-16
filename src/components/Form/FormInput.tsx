import React from 'react'

type FormInputProps = {
    handleChange: (e: any) => void
    label: string
    isMobile: boolean
    validated?: boolean
    [x: string]: any
}

export default function FormInput({ 
        handleChange = f => f, 
        label, 
        isMobile, 
        validated = true, 
        ...otherProps
    }: FormInputProps) {
    return (
        <div className='form__component'>
            <div className='form__group'>
                <input
                    placeholder={isMobile ? label : ""}
                    {...otherProps}
                    onChange={handleChange}
                    style={{ color: validated ? 'black' : 'red' }}
                    className='form__input' />
                <label htmlFor={label} className='form__label'>
                    {label}
				</label>
            </div>
        </div>
    )
}
