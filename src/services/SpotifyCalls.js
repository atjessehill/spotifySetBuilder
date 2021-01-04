import axios from 'axios';
import Cookies from 'universal-cookie';
import querystring from 'querystring';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const { REACT_APP_SPOT_CLIENT, REACT_APP_SPOT_CLIENT_SECRET, REACT_APP_CALLBACK_ENCODED } = process.env;

const cookies = new Cookies();
// let refreshing = false;

axios.interceptors.request.use(req => {
    // console.log("Refreshing is" + refreshing);
    if(cookies.get('SPOT_USER_accessToken')){
        console.log("Adding header");
        req.headers.Authorization = 'Bearer '+cookies.get('SPOT_USER_accessToken')
        return req;
    }
    else{
        console.log("No header");

        return req;
    }

}, error => {
    return Promise.reject(error);
}
);

// axios.interceptors.response.use(res => {

//     return res
// }, (error) => {
//     console.log(error)
//     if (401 == error.response.status || 400 == error.response.status){
//         return refreshAuthLogic()

//     }

//     return Promise.reject(error);
// })

const startRefreshAuth = failedRequest => {
    // refreshing = true;
    console.log("Starting refresh")
    cookies.remove('SPOT_USER_accessToken');
    return refreshAuthLogic(failedRequest);
}


const refreshAuthLogic = failedRequest => {
    return axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify(
            {
                'grant_type': 'refresh_token',
                'refresh_token': cookies.get('SPOT_USER_refreshToken')
            }
        ),
        headers:{
            'Authorization': 'Basic '+ btoa(REACT_APP_SPOT_CLIENT+':'+REACT_APP_SPOT_CLIENT_SECRET),
            'Content-Type': 'application/x-www-form-urlencoded'

        },
    })
    .then(res => {
        const access_token = res.data.access_token;
        cookies.set('SPOT_USER_accessToken', access_token, {path: '/'});
        failedRequest.response.config.headers.Authorization = 'Bearer '+access_token;
        // refreshing=false;
        return Promise.resolve();
    })
    .catch(error => {
        // refreshing=false;
        console.log(error);
    })
}

createAuthRefreshInterceptor(axios, startRefreshAuth);


export const search = async(q) => {
    const query = q.replaceAll(' ', '+')

    return await axios.get(`https://api.spotify.com/v1/search?query=${query}&type=track`)
        .then((res) => {
            return res.data.tracks.items
        })
}

export const getFeatures = async(id) => {
    return await axios.get(`https://api.spotify.com/v1/audio-features/${id}`, {

    })
}

export const requestRecs = async(seed_tracks, metricStr) => {
    return await axios.get(`https://api.spotify.com/v1/recommendations/?&${seed_tracks}&${metricStr}`, {

    })
}

export const createPlaylist = async(playlistname) => {
    const userId = cookies.get('SPOT_USER_ID');
    return await axios({
        method: 'post',
        url: `https://api.spotify.com/v1/users/${userId}/playlists/`,
        data: {
            name: playlistname
        }
    })
    .catch((error) => {
        console.log(error)
    })
}

export const addSongstoPlaylist = async(id, uris) => {
    //TODO replace id with URI earlier 
    const fixedURI = 'spotify:track:'+uris.replaceAll(',', ',spotify:track:')
    console.log(fixedURI)

    return await axios({
        method: 'post',
        url: `https://api.spotify.com/v1/playlists/${id}/tracks?uris=${fixedURI}`,
        // headers: {
        //     'Accept': 'application/json'
        // }
    })
    .catch((error) => {
        console.log(error)
    })
    // return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${uris}`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${key}`,
    //     },
    //   })
}

export const login = () => {
    const scope = 'playlist-modify-public,playlist-modify-private,playlist-read-private,playlist-read-collaborative'
    const redirect = REACT_APP_CALLBACK_ENCODED
    const client_id = 'f4d25f2bdfee4094a7d93f0ec7e4f264'
    const url = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect}&scope=${scope}`
    window.location.assign(url);
    
  }

export const profile = async() => {
    return await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/me`
    })
    .then((res) => {
        console.log(res.data);
        cookies.set('SPOT_DISPLAY_ID', res.data.display_name, {path: '/'});
        cookies.set('SPOT_USER_ID', res.data.id, {path: '/'});
    })
    .catch((error) => {
        console.log(error)
    })
}

export const tracks = async(ids) => {
    const idStr = ids.join(',')
    return await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/tracks/?ids=${idStr}`,
    })
    .then((res) => {
        return res.data.tracks
    })
}

export const artists = async(id) => {
    return await axios({
        method: 'get',
        url: `https://api.spotify.com/v1/artists/${id}`
    })
    .then((res) => {
        return res.data
    })
}

export const isSignedIn = () => {

    if(cookies.get('SPOT_USER_accessToken') && cookies.get('SPOT_USER_refreshToken') && cookies.get('SPOT_USER_ID'))return true

    return false;

}