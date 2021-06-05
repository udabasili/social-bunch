import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Formik } from 'formik';
import FormInput from './form-input.component';
import { login, setCurrentUser } from '../redux/user/user.action';
import Loading from './loader.component';
import { useHistory } from "react-router-dom"

const Login = ({
        login,
        authChangeHandler,
        handleAuthenticationStep,
        setCurrentUser
    }) => {

    const history = useHistory();
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
        <div className="login">
            <Formik
                initialValues={{ email: '', password: '' }}
                validate={values => {
                    const errors = {};
                    if (!values.password) {
                        errors.password = 'Required';
                    } else if (values.password.length > 9) {
                        errors.password = 'Must be 9 characters or more';
                    }
                    if (!values.email) {
                        errors.email = 'Required';
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = 'Invalid email address';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    let response = {
                        ...values,
                        nextRoute: '',
                        fullAuthenticated: true
                    }

                    setSubmitting(true)
                    login(response)
                        .then((response) => {
                            setSubmitting(false)
                            const data = {}
                            data.userId = response._id
                            if (response.fullAuthenticated){
                                setCurrentUser(response)
                                history.push('/')
                            } else if (!response.fullAuthenticated) {
                                authChangeHandler("register")
                                if (response.nextRoute.length === 0){
                                    handleAuthenticationStep('start')
                                }else{
                                    handleAuthenticationStep('image')
                                }
                            }
                        })
                        .catch((e) => {
                            setSubmitting(false)
                        })
                    }}
                >
            {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
            }) => (
                
                <form onSubmit={handleSubmit}>
                    {
                        isSubmitting && <Loading/>
                    }
                    <div className="u-center-text u-margin-bottom-medium u-margin-top-medium">
                        <h1 className="secondary-header">
                            Login
                        </h1>
                    </div>
                    <div className="u-center-text u-margin-bottom-small">
                        <div className='change-auth' >
                            Don't have an account?
                            <span  onClick={() =>authChangeHandler("register")}>Register</span>
                        </div>
                    </div>
                    <FormInput
                        handleChange={handleChange}
                        label='Email'
                        name='email'
                        type='email'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isMobile={isMobile}
                        value={values.email}
                        required />
                    <FormInput
                        handleChange={handleChange}
                        label='Password'
                        name='password'
                        type='password'
                        isMobile={isMobile}
                        value={values.password}
                        required 
                    />
                    <button type="submit" className="button button--submit">
                        Submit
                    </button>
                </form>
            )}
            </Formik>
        </div>
    )
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    authChangeHandler: PropTypes.func.isRequired,
    handleAuthenticationStep: PropTypes.func,
}

const mapDispatchToProps = {
    login,
    setCurrentUser
}

export default connect(null, mapDispatchToProps)(Login)


