import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { IoMdCloseCircle } from 'react-icons/io';
import { Formik } from 'formik';
import FormInput from '../form-input.component';
import { createGroup } from '../../redux/groups/group.action';

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
export const GroupForm = ({
     createGroup,
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
                    GroupName: '',
                    GroupDescription: '',
                    GroupCategory: 'Network',
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    let imageUrl = `https://source.unsplash.com/640x480/?${values.GroupName},${values.GroupCategory}`;
                    let result = {
                        ...values,
                        imageUrl
                    }
                    createGroup(result)
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
                    {/* {
                        isSubmitting && <Loading/>
                    } */}
                    <div className="u-center-text u-margin-bottom-small u-margin-top-small">
                        <h1 className="secondary-header">
                            Add Group
                        </h1>
                    </div>
                    <FormInput
                        handleChange={handleChange}
                        label='Group Name'
                        name='GroupName'
                        type='text'
                        onBlur={handleBlur}
                        isMobile={isMobile}
                        placeholder='Add group name...'
                        value={values.GroupName}
                        required />
                    <textarea
                        cols='3'
                        name='GroupDescription'
                        rows='10'
                        value={values.GroupDescription}
                        onChange={handleChange}
                        placeholder='Add group description...'
                        required
                        className='form__textarea' 
                    />
                    <div className='form__component'>
                        <div className='form__group'>
                            <select 
                                name='GroupCategory'
                                className='form__input'
                                value={values.GroupCategory}
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

GroupForm.propTypes = {
    authChangeHandler: PropTypes.func,
    handleAuthenticationStep: PropTypes.func,
    signUp: PropTypes.func
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    createGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupForm)
