import axios from "axios";


export function TokenHeader(token){
    if(token){
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else{
        delete axios.defaults.headers.common["Authorization"];
    }
}
export  const userId = localStorage.getItem("userId");
export function restApi(method, path, data){
    return new Promise((resolve, reject) => {
        return axios[method](path, data)
            .then((response) => {                
                return resolve(response.data.message)     
            }).catch((error) => {
                return reject(error.response.data.error)
            });
    })
}

//set src value
export const convertBufferToImage = (user) =>{
    console.log(user);
    
    let imageUrl = user.userImage
    imageUrl = "data:image/png;base64," + imageUrl;
    user.userImage = imageUrl
    return user
}