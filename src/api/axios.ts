import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

console.log("base url",baseURL);
const api = axios.create({
    baseURL: baseURL
});

api.interceptors.request.use(
    async(config:any) => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers['Authorization'] = 'Bearer '+token
        }
        return config;
    }
)

api.interceptors.response.use(resp => {
    return resp;
}, error => {
    if(error.status === 401){
        localStorage.removeItem('logged');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.reload();
    }
    return Promise.reject(error.response.data);
});

export default api;