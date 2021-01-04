import React, { useEffect, useRef } from 'react'
/**
 *
 * Close a component if we click outside the component
 * @export
 * @return {*} 
 */

 
function ClickOutside(ref) {
    useEffect(() => {
        
    
        function handleClickOutside(event){
            if(ref.current && ref.current.contains(event.target)){
                // console.log(event.target.className)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)

        }
    }, [ref])
    
}

export default function OutsideAlerter(props) {
    const wrapperRef = useRef(null);
    ClickOutside(wrapperRef);

    return <div ref={wrapperRef}>{props.children}</div>;
}