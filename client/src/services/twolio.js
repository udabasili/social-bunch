import axios from "axios";

export const getTwilioToken = async () =>{
    return axios.get('/video-token').then(results => {
        console.log(results);
        
    })
    .catch(error => console.log(error.response)
    )
}