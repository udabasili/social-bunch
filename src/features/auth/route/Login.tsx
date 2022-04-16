import { useEffect, useState } from 'react'
import { Formik } from 'formik';
import { useNavigate } from "react-router-dom"
import { authenticationStep } from '../type';
import { LoginCredentialsDTO } from '../api/login';
import { useAuth } from '@/lib/auth';
import FormInput from '@/components/Form/FormInput';
import { Button } from '@/components/Elements';


type LoginProps = {
    setAuthenticationStep: (e: authenticationStep) => void
    authChangeHandler: (e: "login" | "register") => void
}

export const Login = ({
        authChangeHandler,
        setAuthenticationStep
    }: LoginProps) => {

    const [isSubmitting, setSubmitting] = useState(false)
    const navigate = useNavigate()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)
    const { loginFn } = useAuth()

    useEffect(() => {
        window.addEventListener('resize', setIsMobileHandler)
        return () => {
            window.removeEventListener('resize', setIsMobileHandler)
        }
    }, [])

    function setIsMobileHandler () {
        setIsMobile(window.innerWidth <= 600)
    }

    const initialValues: LoginCredentialsDTO = { email: '', password: '' }

    return (
        <div className="login">
            <Formik
                initialValues={initialValues}
                validate={values => {
                    const errors = {} as LoginCredentialsDTO;
                    if (!values.password) {
                        errors.password = 'Required';
                    }
                    if (!values.email) {
                        errors.email = 'Required';
                    } 
                    return errors;
                }}
                onSubmit={(values) => {
                    let response = {
                        ...values,
                        nextRoute: '',
                        fullAuthenticated: true
                    }
                    setSubmitting(true)
                    loginFn(response)
                        .then((response) => {
                            setSubmitting(false)
                            if (response?.fullAuthenticated){
                                navigate('/')
                            } else if (!response?.fullAuthenticated) {
                                authChangeHandler("register")
                                if (response?.nextRoute.length === 0){
                                    setAuthenticationStep('start')
                                }else{
                                    setAuthenticationStep('image')
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
            }) => (
                
                <form onSubmit={handleSubmit}>
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
                    <Button 
                        type="submit"  
                        size="lg"
                        variant="primary"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                        >
                        Submit
                    </Button>
                  
                </form>
            )}
            </Formik>
        </div>
    )
}


export default Login