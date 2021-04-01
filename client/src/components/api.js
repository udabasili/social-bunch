import axios from "axios";
const baseUrl = "http://localhost/";
//request interceptor to add the auth token header to requests

export const handleAxios = (userId) =>{
    axios.interceptors.request.use(
        (config) => {
            const accessToken = sessionStorage.getItem("validator");
            if (accessToken) {
                config.headers["authorization"] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => {
            Promise.reject(error);
        }
    );
    //response interceptor to refresh token on receiving token expired error
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        function (error) {
            const originalRequest = error.config;
            if (
                error.response.data.code === 'EXPIREDTOKEN' &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;
                return axios
                    .get(`/api/refresh-token/${userId}`, {
                        withCredentials: true
                    })
                    .then((res) => {
                        if (res.status === 200) {
                            sessionStorage.setItem("validator", res.data.accessToken);
                            console.log("Access token refreshed!");
                            return axios(originalRequest);
                        }
                    });
            }
            return Promise.reject(error);
        }
    );

}
