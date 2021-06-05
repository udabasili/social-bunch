import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
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
import { setCurrentUser } from './redux/user/user.action';
import ProtectedRoute from './components/protected-route.component';
import PostWindow from './components/post-window.component';
import UserPage from './pages/users-page';
import GroupPage from './pages/group-page';
import EventPage from './pages/event-page';
import SettingPage from './pages/setting-page';
import ProfilePage from './pages/profile-page';
import { f } from './services/firebase';
import { firestoreConnect, populate } from 'react-redux-firebase'
import { compose } from 'redux';

const populates = [{
    child: 'user',
    root: 'users'
}]

const MainRoute = ({
        isAuthenticated,
        currentUser,
        users,
        setCurrentUser,
    }) => {


    const firestore = f.firestore()
    const [isLoading, setLoading]  = useState(true)
    
    useEffect(() => {
        const unsubscribe = f.auth().onAuthStateChanged(async (user) => {
            if (user) {
                const data = await firestore
                    .collection("users")
                    .doc(user.uid)
                    .get()
                 if (data.exists) {
                     const userData = data.data();
                     setCurrentUser(userData)
                 }
            }
            setLoading(false)
        });
        return () => {
            unsubscribe()
        }
    }, [])
    

    return (
        !isLoading ? 
        (
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
                        users={users}
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
        ) :
        <div> Loading </div>
    );
}


MainRoute.propTypes = {
    isAuthenticated: PropTypes.bool,
    currentUser: PropTypes.object,
    verifyUser: PropTypes.func,
    setAllUsers: PropTypes.func,
    setCurrentUser: PropTypes.func
}

const mapStateToProps = (state) => {
   
    return {
        isAuthenticated: state.user.authenticated,
        currentUser: state.user.currentUser,
        firebaseAuth: state.firebase
    }
}

const mapDispatchToProps = {
    setCurrentUser
}

export default compose(
    firestoreConnect((props) => [
        {
            collection: 'posts',
        },
        {
			collection: 'comments'
		},

    ]),
    connect(mapStateToProps, mapDispatchToProps)
)(MainRoute);
