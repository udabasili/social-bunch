import { useEffect, useState } from 'react'
 import { Formik } from 'formik';
import { useAuth } from '@/lib/auth';
import { authenticationStep } from '../type';
import { RegisterCredentialsDTO } from '../api/register';
import FormInput from '@/components/Form/FormInput';
import { Button } from '@/components/Elements';

type RegisterProps = {
    setAuthenticationStep: (e: authenticationStep) => void
    authChangeHandler: (e: "login" | "register") => void
}

const Register = ({
        authChangeHandler,
        setAuthenticationStep,
    }: RegisterProps) => {
    
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)
    const { registerFn } = useAuth()
    const [isSubmitting, setSubmitting] = useState(false)


    useEffect(() => {
        window.addEventListener('resize', setIsMobileHandler)
        return () => {
            window.removeEventListener('resize', setIsMobileHandler)
        }
    }, [])

    function setIsMobileHandler () {
        setIsMobile(window.innerWidth <= 600)
    }

    const initialValues: RegisterCredentialsDTO  = { 
        username: '',
        email: '', 
        password: '' ,
        confirmPassword: ''
    }

    return (
        <div className="register">
            <Formik
                initialValues={initialValues}
                validate={values => {
                    const errors = {} as RegisterCredentialsDTO;
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
                onSubmit={async (values) => {
                    let response = {
                        ...values,
                    }
                    
                    setSubmitting(true)
                    registerFn(response)
                        .then(() =>{
                            setSubmitting(false)
                            setAuthenticationStep('image')
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
            }) => (
                
                <form onSubmit={handleSubmit}>
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

export default Register
