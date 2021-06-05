import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route } from 'react-router';

const ProtectedRoute = ({
    component: Component, 
    isAuthenticated,
    currentUser,
    ...otherProps
    }) => {

    return (
        <React.Fragment>
            {isAuthenticated ?
                <Route 
                    {...otherProps} 
                    render={(props) =>(
                        <Component 
                            {...props} 
                            currentUser={currentUser}  
                            isAuthenticated={isAuthenticated}
                        />
                    )}
                /> :
                <Redirect
                    to={{
                        pathname: '/auth',
                        state:{
                            prevRoute: otherProps.path
                        }
                    }}
                />
            
            } 

        </React.Fragment>
    )
}

ProtectedRoute.propTypes = {
    component: PropTypes.any,
    isAuthenticated: PropTypes.bool,
    currentUser: PropTypes.object,
    otherProps: PropTypes.object
}

export default ProtectedRoute
