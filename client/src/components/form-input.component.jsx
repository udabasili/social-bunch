import React from 'react'

export default function FormInput({ handleChange = F=> F, label, isMobile, validated = true, ...otherProps}) {
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
