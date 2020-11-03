import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

axios.interceptors.request.use(req => {
    if(cookies.get('SPOT_USER_accessToken')){
        req.headers.Authorization = 'Bearer '+cookies.get('SPOT_USER_accessToken')
        return req;
    } 
}, error => {
    return Promise.reject(error);
}
);

export const getFeatures = async(id) => {
    return await axios.get(`https://api.spotify.com/v1/audio-features/${id}`, {

    })
}