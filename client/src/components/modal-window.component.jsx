import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';

const ModalWindow = ({ closeHandler, children, setCloseButton=true, history}) =>  {
    return (
        <div className='modal-container'>
            <div className='modal-content'>
                {setCloseButton &&
                    <FontAwesomeIcon
                        className='close-button'
                        onClick={closeHandler}
                        icon={faTimes} />
                }
                
                    {children}
            </div>
        </div>
    )
    
    }

export default withRouter(ModalWindow);