import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { IoMdCloseCircle } from 'react-icons/io';
import { Formik } from 'formik';
import { useCreateEvent } from '../api/createEvents';
import FormInput from '@/components/Form/FormInput';
import { Button } from '@/components/Elements';

const CATEGORIES = [
    'Art',
    'Causes',
    'Comedy',
    'Craft',
    'Dance',
    'Film',
    'Food',
    'Games',
    'Gardening',
    'Health',
    'Literature',
    'Music',
    'Network',
    'Party',
    'Religion',
    'Shopping',
    'Sports'
]

type GroupFormProps = {
    showModalHandler: (show: boolean) => void
}
export const GroupForm = ({
     showModalHandler
}: GroupFormProps) => {

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)
    const { createEventFn } = useCreateEvent()
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
        window.addEventListener('resize', setIsMobileHandler)
        return () => {
            window.removeEventListener('resize', setIsMobileHandler)
        }
    }, [])

    function setIsMobileHandler() {
        setIsMobile(window.innerWidth <= 600)
    }
    return (
        <div className="event-form-container">
            <IoMdCloseCircle 
                className="close-button"
                onClick={ ()=>showModalHandler(false) }
            />
            <Formik
                initialValues={{ 
                    eventName: '',
                    eventDescription: '',
                    eventDate: '',
                    eventTime: '',
                    category: 'Network',
                    location: ''
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setIsLoading(true)
                    let response = {
                        ...values,
                        eventDate: new Date(values.eventDate + " " + values.eventTime )
                    }
                    createEventFn(response)
                    .then(() =>{
                        setIsLoading(false)
                        showModalHandler(false)
                    })
                    .catch(() => {
                        setIsLoading(false)
                    })
                }}
                >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
            }) => (
                
                <form onSubmit={handleSubmit}>
        
                    <div className="u-center-text u-margin-bottom-small u-margin-top-small">
                        <h1 className="secondary-header">
                            Add Event
                        </h1>
                    </div>
                    <FormInput
                        handleChange={handleChange}
                        label='Event Name'
                        name='eventName'
                        type='text'
                        onBlur={handleBlur}
                        isMobile={isMobile}
                        value={values.eventName}
                        required />
                    <FormInput
                        handleChange={handleChange}
                        label='Location'
                        name='location'
                        type='text'
                        onBlur={handleBlur}
                        isMobile={isMobile}
                        value={values.location}
                        required />
                    <textarea
                        cols={3}
                        name='eventDescription'
                        rows={10}
                        value={values.eventDescription}
                        onChange={handleChange}
                        placeholder='Summary of Event'
                        required
                        className='form__textarea' />
                    <div className='form-multiple'>
                        <FormInput
                            handleChange={handleChange}
                            label = 'Event Date'
                            name='eventDate'
                            type='date'
                            onBlur={handleBlur}
                            isMobile={isMobile}
                            value = {
                                values.eventDate
                            }
                            required 
                        />
                        <FormInput
                            handleChange={handleChange}
                            label='Event Time'
                            name='eventTime'
                            type='time'
                            onBlur={handleBlur}
                            isMobile={isMobile}
                            value={values.eventTime}
                            required 
                        />
                    </div>
                    <div className='form__component'>
                        <div className='form__group'>
                            <select 
                                name='category'
                                className='form__input'
                                value={values.category}
                                required
                                onChange={handleChange}>
                                {
                                    CATEGORIES.map((category, index) => (
                                        <option value={category} key={index}>
                                            {category}
                                        </option>
                                    ))
                                }
                            </select>
                            <label  className='form__label'>
                                Event Category
                            </label>
                        </div>
                    </div>
  
                    <Button 
                        type='submit'
                        size="lg"
                        variant="primary"
                        isLoading={isLoading}
                        disabled={Object.keys(errors).length > 0 || isLoading}
                        >
                            Submit
                    </Button>
                </form>
            )}
            </Formik>
        </div>
    )
  
}

export default GroupForm
