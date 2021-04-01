import React, { useEffect } from 'react';
import {
    Switch, Route, Redirect
} from 'react-router-dom';
import Footer from './components/footer.component';
import LeftNavigation from './components/left-navigation.component';
import Navigation from './components/navigation.component';
import HomePage from './pages/home-page';
import MessagePage from './pages/messages.page';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AuthPage from './pages/auth-page';
import { setCsrfToken, verifyUser } from './redux/user/user.action';
import ProtectedRoute from './components/protected-route.component';
import PostWindow from './components/post-window.component';
import { handleAxios } from './components/api';
import { getPosts } from './redux/posts/post.actions';
import { 
    getAllUsers, 
    setAllUsers 
} from './redux/users/users.action';
import UserPage from './pages/users-page';
import GroupPage from './pages/group-page';
import EventPage from './pages/event-page';
import Socket from './services/chat-client';
import SettingPage from './pages/setting-page';
import ProfilePage from './pages/profile-page';


const MainRoute = ({
        isAuthenticated,
        currentUser,
        getAllUsers,
        getPosts,
        verifyUser
    }) => {

    setCsrfToken()
    const socket = new Socket()
    if (isAuthenticated) {
        handleAxios(currentUser._id)
    }

    useEffect(() => {
        //user@yahoo.com
        window.addEventListener('beforeunload', disconnectHandler);
        getAllUsers()
        if(isAuthenticated){
            let data = {}
            data.userId = currentUser._id
            socket.setUserSocket(data)
            handleAxios(currentUser._id)
            getPosts()
            verifyUser()
            .then(() => {
            })
            .catch((error) => {
                console.log(error)
            })
        }
        
        return () => {
            window.removeEventListener('beforeunload', disconnectHandler);
        }
        
        
    }, [isAuthenticated, verifyUser])

    

    function disconnectHandler(e){
        socket.disconnect()
    }
    return (
        <React.Fragment>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
                />
            {
                isAuthenticated && (
                    <Navigation 
                        currentUser={currentUser}
                    />
                )
            }
            <main>
                {
                    isAuthenticated && (
                        <LeftNavigation />
                    )
                }
                <Switch>
                    <Route 
                        path='/auth'
                        render={props => (
                            !isAuthenticated ?
                            <AuthPage 
                                currentUser={currentUser} 
                                {...props}
                            /> :
                            <Redirect to='/'/>
                        )}
                    />
                    <ProtectedRoute 
                        isAuthenticated={isAuthenticated}
                        currentUser={currentUser}
                        component={HomePage} 
                        path='/' 
                        exact
                    />
                    <ProtectedRoute 
                        isAuthenticated={isAuthenticated}
                        currentUser={currentUser}
                        component={PostWindow} 
                        path='/posts/:postId' 
                        exact
                    />
                    <ProtectedRoute 
                        isAuthenticated={isAuthenticated}
                        currentUser={currentUser}
                        component={ProfilePage} 
                        path='/profile' 
                        
                    />
                    <ProtectedRoute 
                        isAuthenticated={isAuthenticated}
                        currentUser={currentUser}
                        component={SettingPage} 
                        path='/settings' 
                    />
                    <ProtectedRoute 
                        isAuthenticated={isAuthenticated}
                        currentUser={currentUser}
                        component={UserPage} 
                        path='/users' 
                        exact
                    />
                    <ProtectedRoute 
                        isAuthenticated={isAuthenticated}
                        currentUser={currentUser}
                        component={EventPage} 
                        path='/events' 
                        exact
                    />
                    <ProtectedRoute 
                        isAuthenticated={isAuthenticated}
                        currentUser={currentUser}
                        component={GroupPage} 
                        path='/groups' 
                        exact
                    />
                    <ProtectedRoute 
                        isAuthenticated={isAuthenticated}
                        currentUser={currentUser}
                        component={MessagePage} 
                        path='/messages' 
                        exact
                    />
                </Switch>
            </main>
            <Footer/>
        </React.Fragment>
    );
}


MainRoute.propTypes = {
    isAuthenticated: PropTypes.bool,
    currentUser: PropTypes.object,
    verifyUser: PropTypes.func,
    setAllUsers: PropTypes.func,
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.user.authenticated,
    currentUser: state.user.currentUser
})

const mapDispatchToProps = {
    verifyUser,
    setAllUsers,
    getPosts,
    getAllUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(MainRoute);
