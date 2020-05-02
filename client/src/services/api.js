import axios from "axios";

/**
 * set the default token header for axios request
 * @param token
 * @constructor
 */
export function TokenHeader(token){
    if(token){
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else{
        delete axios.defaults.headers.common["Authorization"];
    }
}

/**
 * axios request handler
 * @param method
 * @param path
 * @param data
 * @returns {Promise}
 */
export function restApi(method, path, data){
    return new Promise((resolve, reject) => {
        return axios[method](path, data)
            .then((response) => {                
                return resolve(response.data.message)     
            })
            .catch((error) => {
                return reject(error.response.data)
        });
    })
}

