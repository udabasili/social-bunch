import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { IoMdCloseCircle } from 'react-icons/io';
import { Formik } from 'formik';
import FormInput from '../form-input.component';
import Loading from '../loader.component';
import { createEvent } from '../../redux/events/event.action';


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
export const EventForm = ({
     createEvent,
     showModalHandler
}) => {

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)

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
                    EventName: '',
                    EventDescription: '',
                    EventDate: '',
                    EventTime: '',
                    EventCategory: 'Network',
                    Location: ''
                }}
                onSubmit={(values, { setSubmitting }) => {
                    let response = {
                        ...values,
                        EventDate: new Date(values.EventDate + " " + values.EventTime )
                    }
                    createEvent(response)
                    .then(() =>{
                        setSubmitting(false)
                        showModalHandler(false)
                    })
                    .catch(() => {
                        setSubmitting(false)
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
                    {
                        isSubmitting && <Loading/>
                    }
                    <div className="u-center-text u-margin-bottom-small u-margin-top-small">
                        <h1 className="secondary-header">
                            Add Event
                        </h1>
                    </div>
                    <FormInput
                        handleChange={handleChange}
                        label='Event Name'
                        name='EventName'
                        type='text'
                        onBlur={handleBlur}
                        isMobile={isMobile}
                        value={values.EventName}
                        required />
                    <FormInput
                        handleChange={handleChange}
                        label='Location'
                        name='Location'
                        type='text'
                        onBlur={handleBlur}
                        isMobile={isMobile}
                        value={values.Location}
                        required />
                    <textarea
                        cols='3'
                        name='EventDescription'
                        rows='10'
                        value={values.EventDescription}
                        onChange={handleChange}
                        placeholder='Summary of Event'
                        required
                        className='form__textarea' />
                    <div className='form-multiple'>
                        <FormInput
                            handleChange={handleChange}
                            label = 'Event Date'
                            name='EventDate'
                            type='date'
                            onBlur={handleBlur}
                            isMobile={isMobile}
                            value = {
                                values.EventDate
                            }
                            required 
                        />
                        <FormInput
                            handleChange={handleChange}
                            label='Event Time'
                            name='EventTime'
                            type='time'
                            onBlur={handleBlur}
                            isMobile={isMobile}
                            value={values.EventTime}
                            required 
                        />
                    </div>
                    <div className='form__component'>
                        <div className='form__group'>
                            <select 
                                name='EventCategory'
                                className='form__input'
                                value={values.EventCategory}
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
  
                    <button 
                        type="submit"  
                        disabled={Object.keys(errors).length > 0}
                        className="button button--submit">
                        Submit
                    </button>
                </form>
            )}
            </Formik>
        </div>
    )
  
}

EventForm.propTypes = {
    authChangeHandler: PropTypes.func,
    handleAuthenticationStep: PropTypes.func,
    signUp: PropTypes.func
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    createEvent
}

export default connect(mapStateToProps, mapDispatchToProps)(EventForm)
