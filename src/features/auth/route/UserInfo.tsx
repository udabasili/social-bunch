import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useUpdateUser } from '@/features/user/api/updateUser';
import FormInput from '@/components/Form/FormInput';
import { Button } from '@/components/Elements';

function UserInfo() {
    
    const navigator = useNavigate();
    const { updateUserFn } = useUpdateUser()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUserData] = useState({
        bio: '',
        occupation: '',
        location: '',
        dateOfBirth: new Date()
    })

    useEffect(() => {
        window.addEventListener('resize', setIsMobileHandler)
        return () => {
            window.removeEventListener('resize', setIsMobileHandler)
        }
    }, [])

    function setIsMobileHandler() {
        setIsMobile(window.innerWidth <= 600)
    }

    function onSubmitHandler(e: FormEvent<HTMLFormElement>) {
        setSubmitting(true)
        e.preventDefault()
        updateUserFn(user)
        .then(() => {
            setSubmitting(false)
            navigator("/");
        })
        .catch((e) => {
            setSubmitting(false)
        })
    }

    function onChangeHandler(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const {name, value} = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    return (
        <div className="register user-info">
            <form className='form' onSubmit={onSubmitHandler} >
                <div className='form__group'>
                    <textarea
                        cols={3}
                        name='bio'
                        rows={10}
                        value={user.bio}
                        onChange={onChangeHandler}
                        placeholder='Write your bio here'
                        required
                        className='form__textarea' />
                </div>
                <FormInput 
                    label='Occupation'
                    name='occupation'
                    handleChange={onChangeHandler}
                    type='text'
                    isMobile={isMobile}
                    value={user.occupation}
                    required />
                <FormInput 
                    label='Location'
                    name='location'
                    handleChange={onChangeHandler}
                    type='text'
                    isMobile={isMobile}
                    value={user.location}
                    required />
                <div className='form__component'>
                    <div className='form__group'>
                        <input
                            name='dateOfBirth'
                            type='date'
                            onChange={onChangeHandler}
                            className='form__input' 
                            required
                            />
                        <label htmlFor='dateOfBirth' className='form__label'>
                            Date of Birth
                        </label>
                    </div>
                </div>
                <Button 
                  type="submit"  
                  size="lg"
                  variant="primary"
                  isLoading={submitting}
                  disabled={submitting}
                  >
                  Submit
              </Button>
            </form>
        </div>
    )
}

export default UserInfo


