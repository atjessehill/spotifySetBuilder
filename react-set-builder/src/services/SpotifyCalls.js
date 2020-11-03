import axios from 'axios';
import Cookies from 'universal-cookie';
import querystring from 'querystring';

const cookies = new Cookies();

axios.interceptors.request.use(req => {
    if(cookies.get('SPOT_USER_accessToken')){
        console.log("cookie found")
        req.headers.Authorization = 'Bearer '+cookies.get('SPOT_USER_accessToken')
        return req;
    } 
}, (error) => {
    if (401 == error.response.status){
        console.log("This is a 401 error")
    }
    return Promise.reject(error);
}
);

export const getFeatures = async(id) => {
    return await axios.get(`https://api.spotify.com/v1/audio-features/${id}`, {

    })
}

export const requestRecs = async(seed_tracks, metricStr) => {
    return await axios.get(`https://api.spotify.com/v1/recommendations/?&${seed_tracks}&${metricStr}`, {

    })
}

export const createPlaylist = async(playlistname) => {
    // return fetch('https://api.spotify.com/v1/users/jup118/playlists/', {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': `Bearer ${cookies.get('SPOT_USER_accessToken')}`
    //     },
    //     body: JSON.stringify({name: playlistname})
    //   })

    return await axios({
        method: 'post',
        url: 'https://api.spotify.com/v1/users/jup118/playlists/',
        data: {
            name: playlistname
        }
    })
    .catch((error) => {
        console.log(error)
    })
}

export const addSongstoPlaylist = async(id, uris) => {
    // console.log(uris)
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
    console.log('login');
    const scope = 'playlist-modify-public,playlist-modify-private,playlist-read-private,playlist-read-collaborative'
    const redirect = 'http%3A%2F%2Flocalhost%3A3000%2Flogin'
    const client_id = 'f4d25f2bdfee4094a7d93f0ec7e4f264'
    const url = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect}&scope=${scope}`
    window.location.assign(url);
    
  }