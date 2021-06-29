import React, { Component } from 'react'
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../redux/user/user.action';
import { auth, f } from '../../services/firebase';
import LoadingMessage from './LoadingMessage';


function WithSplashScreen(WrappedComponent) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                loading: true
            }
        }

            

        setListener = async () => {
            const firestore = f.firestore()
            this.unsubscribe = f.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    const data = await firestore
                        .collection("users")
                        .doc(user.uid)
                        .get()
                    if (data.exists) {
                        const userData = data.data();
                        setCurrentUser(userData)
                    }
                    this.setState({
                        loading: false,
                    });
                }
           })
        }

        async componentDidMount() {
            try {
                this.setListener()
                setTimeout(() => {
                    this.setState({
                        loading: false,
                    });
                }, 3000)
            } catch (err) {
                this.setState({
                    loading: false,
                });
            }
        }

        componentWillUnmount() {
            this.unsubscribe()
        }

        render() {
            if (this.state.loading) return LoadingMessage();
            return <WrappedComponent {...this.props} />;
        }
    };  
}

export default WithSplashScreen;
