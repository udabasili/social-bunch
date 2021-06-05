import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
 import { Formik } from 'formik';
import FormInput from './form-input.component';
import { signUp } from '../redux/user/user.action';
import Loading from './loader.component';

const Register = ({
        authChangeHandler,
        handleAuthenticationStep,
        signUp
    }) => {
    
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)

    useEffect(() => {
        window.addEventListener('resize', setIsMobileHandler)
        return () => {
            window.removeEventListener('resize', setIsMobileHandler)
        }
    }, [])

    function setIsMobileHandler () {
        setIsMobile(window.innerWidth <= 600)
    }

    return (
        <div className="register">
            <Formik
                initialValues={{ 
                    username: '',
                    email: '', 
                    password: '' ,
                    confirmPassword: ''
                }}
                validate={values => {
                    const errors = {};
                    if (values.password.length < 9) {
                        errors.password = 'Must be 9 characters or more';
                    }
                    if (values.confirmPassword !== values.password) {
                        errors.confirmPassword = 'The passwords must match';
                    }
                    if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = 'Invalid email address';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    let response = {
                        ...values,
                        nextRoute: 'image'
                    }
                    setSubmitting(true)
                    signUp(response)
                        .then(() =>{
                            setSubmitting(false)
                            handleAuthenticationStep('image')
                        })
                        .catch((e) =>{
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
                            Register
                        </h1>
                    </div>
                    <div className="u-center-text u-margin-bottom-small">
                        <div className='change-auth'  onClick={() =>authChangeHandler("login")}>
                            Already registered?
                            <span>Login</span>
                        </div>
                    </div>
                    <FormInput
                        handleChange={handleChange}
                        label='Username'
                        name='username'
                        type='username'
                        onBlur={handleBlur}
                        isMobile={isMobile}
                        value={values.username}
                        required />
                        <div className="error">
                            {
                                errors.username && 
                                touched.username && 
                                errors.username
                            }
                        </div>
                    <FormInput
                        handleChange={handleChange}
                        label='Email'
                        name='email'
                        type='email'
                        onBlur={handleBlur}
                        isMobile={isMobile}
                        value={values.email}
                        required />
                        <div className="error">
                            {
                                errors.email &&
                                touched.email &&
                                errors.email
                            }
                        </div>
						<FormInput
                            handleChange={handleChange}
                            label='Password'
                            name='password'
                            type='password'
                            onBlur={handleBlur}
                            isMobile={isMobile}
                            value={values.password}
                            required 
                        />
                        <div className="error">
                            {
                                errors.password &&
                                touched.password &&
                                errors.password
                            }
                        </div>
                        <FormInput
                            handleChange={handleChange}
                            label='Confirm Password'
                            name='confirmPassword'
                            type='password'
                            onBlur={handleBlur}
                            isMobile={isMobile}
                            value={values.confirmPassword}
                            required 
                        />
                        <div className="error">
                            {
                            errors.confirmPassword && 
                            touched.confirmPassword &&
                            errors.confirmPassword
                            }
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

Register.propTypes = {
    authChangeHandler: PropTypes.func.isRequired,
    handleAuthenticationStep: PropTypes.func.isRequired,
    signUp: PropTypes.func.isRequired
}

const mapDispatchToProps = {
    signUp
}

export default connect(null, mapDispatchToProps)(Register)
