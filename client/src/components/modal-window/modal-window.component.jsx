import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';

const ModalWindow = (props) =>  {
    const {closeHandler, children} = props
    return (
        <div className='modal-container'>
            <div className='modal-content'>
                <FontAwesomeIcon 
                    className='close-button' 
                    onClick={()=>{
                        closeHandler(false)
                        props.history.push('/')

                    }} 
                    icon={faTimes}/>
                    {children}
            </div>
        </div>
    )
    
    }

export default withRouter(ModalWindow);