import React, { useState, useRef, useEffect } from 'react';
import '../App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Column from 'react-bootstrap/CardColumns';
import Column from 'react-bootstrap/Col';
import Lolipop from './Lolipop';
import axios from 'axios';
import Cookies from 'universal-cookie';

function PlaylistBuilder() {
  const cookies = new Cookies();
  console.log(cookies.get('SPOT_USER_accessToken'))
  console.log(cookies.get('SPOT_USER_refreshToken'))

  const [data, setData] = useState(songs)
  let generated = false;
  const seed = {
    'location': 2,
    'id': '0dDG6oBNPPkQHKE8UC5Mc1'
  }
  const key = 'BQBsQKUZ3NGnyPlcyuY1lgFDkcmuYpZV0ecw54n9g1vaXPWtRJ4U6daNgDqGOPV0notpgauQwNvJxvopHh8wDeBIk0X5MD9ggsfKoD50Cokxg15inOUzeXzO76stzvyuZGb0hNz1kfWMC5WBMCfZr0b1pNaagycbG1UY1w4tcj199wfDtC9UO4LVo3IQv_kMWvRr6vbmdI6XQAVWmIWo9dvozRijtZ3-PKfBaI2gLZzdNITatv0'
  
  let thisplaylist = new Array(data.length).fill(0)
  let testval = 0
  data.forEach(d => {
    d.id = d.id
  })

  async function getFeatures(id){
    return await axios.get(`https://api.spotify.com/v1/audio-features/${id}`, {
      headers: {
        'Authorization': `Bearer ${key}`
      }

    })
      
  }

  function getRecommendations(i, start,  end, k){
    console.log("K is ")
    console.log(k)
    return new Promise((resolve, reject) => {

      const seeds = thisplaylist.slice(start, end)
      let seed_tracks = "seed_tracks="+seeds.join(',')
      let metricList = [];
      for (let metric in k){
        metricList.push(metric+'='+k[metric])
      }
      let metricStr = metricList.join('&')
      console.log("REQUESTING" + seed_tracks + " " + metricStr)
      console.log(" AT " + i )
      axios.get(`https://api.spotify.com/v1/recommendations/?&${seed_tracks}&${metricStr}`, {
      headers: {
        'Authorization': `Bearer ${key}`,
      }
      })
      .then((res) => {
        let recs = res.data.tracks;
        if (recs.length == 0)console.log("Could not find recommendations"); // TODO add rejection and error checking

        for (let track in recs){
          if(!thisplaylist.includes(recs[track].id)){
            thisplaylist[i] = recs[track].id;
          }
        }
        resolve();

        
      })

    })

  }

  function generate(){

    const length = data.length;
    const seedIndex = seed['location']
    let features;

    let targets= {
      'target_danceability': data.map((d) => d.danceability),
      'target_energy': data.map((d) => d.energy),
      'target_valence': data.map((d) => d.valence),
      'target_instrumentalness': data.map((d) => d.instrumentalness)
    }

    thisplaylist[seedIndex] = seed['id']
    getFeatures(seed['id'])
    .then((res) => {
      features = res.data
      for (let metric in targets){

        if (metric == 'target_instrumentalness') continue
        const offset = features[metric.split('_')[1]] - targets[metric][seedIndex]
        
        // Prevent huge fluctuation in value, especially above 1
        targets[metric] = (offset > 0) ? targets[metric].map((val) => {
          return val+offset
        }) : targets[metric].map((val) => {
          return val-offset
        })
      }

    })
    .then(() => {

      let promise = Promise.resolve()

      for(let i=seedIndex+1; i<length; i++){
        const k = {}
        for(let metric in targets){
          k[metric] = targets[metric][i]
        }
        const end = seedIndex + Math.min(i-seedIndex, 5)

        promise = addToChain(promise, i, seedIndex, end, k)
       

      }

      for(let i=seedIndex-1; i>-1; i--){
        const k = {}
        for(let metric in targets){
          k[metric] = targets[metric][i]
        }
        let x = thisplaylist.length-i
        x = (x >=5) ? 5 : x
        const start = i+1;
        const end = i+x+1

        promise = addToChain(promise, i, start, end, k)
        

      }
      promise.finally(() => {
        generated=true;
        console.log("Done")
        console.log(thisplaylist)
      })
    })

    
  }

  function addToChain(chain, i, start, end, k){
    return chain.then(() => {
      return getRecommendations(i, start, end, k);
    })
  }

  function addSong(){

    const newTrack = {
      id: "xx"+(data.length+1).toString(),
      danceability: Math.max(data[data.length-1].danceability-5, 25),
      energy: Math.max(data[data.length-1].energy-5, 25),
      instrumentalness: Math.max(data[data.length-1].instrumentalness-5, 25),
      valence: Math.max(data[data.length-1].valence-5, 25)
    }
    console.log(newTrack);

    setData([...data, newTrack])
  }

  function removeSong(){
    if (data.length == 1)return
    data.pop();
    setData([...data]);
  }

  function login(){
    console.log('login');
    const scope = 'playlist-modify-public'
    const redirect = 'http%3A%2F%2Flocalhost%3A3000%2Flogin'
    const client_id = 'f4d25f2bdfee4094a7d93f0ec7e4f264'
    const url = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect}&scope=${scope}`
    window.location.assign(url);
    
  }

  function savePlaylist(){
    const TESTplaylistName = 'TESTplaylist';
    if (!generated)return

    return fetch('https://api.spotify.com/v1/users/jup118/playlists/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({name: "testnamehere"})
    })
    .then((res)=>{
      if(res.ok)return res.json()
      throw new Error('Request failed: Creating playlist!');
    })
    .then((jsonResponse) => {
      const playlistId = jsonResponse.id
      const uris = thisplaylist.join('')
      console.log(playlistId)
      return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${uris}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
        },
      })
      .then((res) => {
        if (res.ok) return res.json();
        console.log(res);
        // throw new Error('Request Failed: Adding songs to playlist');
      })
      .then((response) => {
        console.log(response);
      })
    });


    // axios({
    //   method: 'POST',
    //   url: 'https://api.spotify.com/v1/users/jup118/playlists/',
    //     'Authorization': `Bearer ${key}`,
    //   body: JSON.stringify({name: "testnamehere"})
    // }
    // )
    // .then((res) =>{
    //   console.log(res)
    // })
    // .catch((error) => {
    //   console.log(error);
    // })
      // headers: {
      //   'Authorization': `Bearer ${key}`,
      // },
      // body: JSON.stringify({name: "zzzzzz"})
      // })


  }

  return (
    // <React.Fragment>
      <Container id='view-area'>
        <Row>
          <Column id='parameter-col'>
            <input type="text" id="name-input" placeholder="my special playlist"></input>
            <br/>
            <div id="num-track-display">
              <h5> {data.length} tracks</h5>
              <button class="trackbutton" onClick={addSong}> + </button>
              <button class="trackbutton" onClick={removeSong}> - </button>
            </div>
            <button onClick={generate}> generate </button>
            <button onClick={savePlaylist}> Save Playlist </button>

          </Column>
          <Column id='chart-col'>
            <Lolipop data={data} />
          </Column>
          <Column id='right-col'>
            <h1> Col 3</h1>
            <button onClick={login}> Login to Spotify </button> 
          </Column>
        </Row>
      </Container>
    // </React.Fragment>
  );
}



var songs = [
  {
    id: "xxx1",
    danceability: 65,
    energy: 65,
    valence: 65, 
    instrumentalness: 65
  },
  {
    id: "xxx2",
    danceability: 75,
    energy: 75,
    valence: 75, 
    instrumentalness: 75
  },
  {
    id: "xxx3",
    danceability: 85,
    energy: 85,
    valence: 85, 
    instrumentalness: 85
  },
  {
    id: "xxx4",
    danceability: 85,
    energy: 85,
    valence: 85, 
    instrumentalness: 85
  },
  {
    id: "xxx5",
    danceability: 72,
    energy: 72,
    valence: 72, 
    instrumentalness: 72
  },
  {
    id: "xxx6",
    danceability: 65,
    energy: 65,
    valence: 65, 
    instrumentalness: 65
  },
]

export default PlaylistBuilder;