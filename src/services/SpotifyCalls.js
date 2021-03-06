import axios from 'axios';
import Cookies from 'universal-cookie';
import querystring from 'querystring';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const { REACT_APP_SPOT_CLIENT, 
    REACT_APP_SPOT_CLIENT_SECRET, 
    REACT_APP_CALLBACK_ENCODED_HOME, 
    REACT_APP_CALLBACK_ENCODED_GENERATE,
    REACT_APP_LOGOUT_REDIRECT } = process.env;

const cookies = new Cookies();
// let refreshing = false;

axios.interceptors.request.use(req => {
    // console.log("Refreshing is" + refreshing);
    if(cookies.get('SPOT_USER_accessToken')){
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

export const removeAndLogout = () => {
    const c = new Cookies();

    c.remove('SPOT_USER_accessToken', {path: '/'});
    c.remove('SPOT_USER_refreshToken', {path: '/'});
    c.remove('SPOT_DISPLAY_ID', {path: '/'});
    c.remove('SPOT_USER_ID', {path: '/'});
    // console.log(url)
    window.location.assign(REACT_APP_LOGOUT_REDIRECT);

}

const startRefreshAuth = failedRequest => {
    // refreshing = true;
    console.log("Starting refresh")
    cookies.remove('SPOT_USER_accessToken', {path: '/'});
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
    
    // console.log(seed_tracks);
    // console.log(metricStr);

    return await axios.get(`https://api.spotify.com/v1/recommendations/?&${seed_tracks}&${metricStr}`, {

    }, (res) => {
        console.log(res);
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

export const login = (toGenerate) => {

    const scope = 'playlist-modify-public,playlist-modify-private,playlist-read-private,playlist-read-collaborative,streaming'
    const redirect = toGenerate ? REACT_APP_CALLBACK_ENCODED_GENERATE : REACT_APP_CALLBACK_ENCODED_HOME
    console.log(redirect)
    const client_id = 'f4d25f2bdfee4094a7d93f0ec7e4f264'
    const url = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect}&scope=${scope}`
    // console.log(url)
    window.location.assign(url);
    // "http%3A%2F%2Flocalhost%3A3000%2Flogin%2Fgenerate"
    // "http%3A%2F%2Flocalhost%3A3000%2Flogin%2Fgenerate"
    // "http%3A%2F%2Flocalhost%3A3000%2Flogin%2Fgenerate"
    /*
    https://accounts.spotify.com/authorize?
    client_id=f4d25f2bdfee4094a7d93f0ec7e4f264&
    response_type=code&
    redirect_uri= http%3A%2F%2Flocalhost%3A3000%2Flogin%2Fhome


https://accounts.spotify.com/authorize?client_id=f4d25f2bdfee4094a7d93f0ec7e4f264&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin%2Fgenerate


    */
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
    console.log(id);
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

export const getPlayer = () => {
    return new window.Spotify.Player({
        name: "NoShuffle.club",
        getOAuthToken: cb => { cb(cookies.get('SPOT_USER_accessToken'));}
    })
}

export const addToPlay = (device_id, songs) => {
    console.log(device_id);
    console.log(songs);
    //device_id: A string used to identify our web sdk device
    // songs: a list of song URIs in form ["spotify:track:xxxx",...]
    return axios({
        method: 'put',
        url: `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
        data: {
            uris: songs
        }
        
        // headers: {
        //     'Accept': 'application/json'
        // }
    })
    .catch((error) => {
        console.log(error)
    })
}