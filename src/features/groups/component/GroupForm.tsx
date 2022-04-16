import React, { useEffect, useState } from 'react'
import { IoMdCloseCircle } from 'react-icons/io';
import { Formik } from 'formik';
import { useCreateGroup } from '../api/createGroup';
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
    const { createGroupFn } = useCreateGroup()
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
                    groupName: '',
                    description: '',
                    category: 'Network',
                }}
                onSubmit={async (values) => {
                    let imageUrl = `https://source.unsplash.com/500x480/?${values.groupName},${values.category}`;
                    let result = {
                        ...values,
                        imageUrl
                    }
                    setIsLoading(true)
                    createGroupFn(result)
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
                        name='groupName'
                        type='text'
                        onBlur={handleBlur}
                        isMobile={isMobile}
                        placeholder='Add group name...'
                        value={values.groupName}
                        required />
                    <textarea
                        cols={3}
                        name='description'
                        rows={10}
                        value={values.description}
                        onChange={handleChange}
                        placeholder='Add group description...'
                        required
                        className='form__textarea' 
                    />
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
