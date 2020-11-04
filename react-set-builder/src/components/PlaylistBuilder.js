import React, { useState, useRef, useEffect } from 'react';
import '../App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Column from 'react-bootstrap/CardColumns';
import Column from 'react-bootstrap/Col';
import Lolipop from './Lolipop';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {getFeatures, requestRecs, login, createPlaylist, addSongstoPlaylist } from '../services/SpotifyCalls';
let PLAYLIST_NAME_MAIN = 'TEST PLAYLIST FROM setBuilder';
let SEED_LOC_MAIN = 2;
let SEED_URI_MAIN = 'spotify:track:5tIhRlNkApQJoDA8zhOBUY';

function PlaylistBuilder() {
  const cookies = new Cookies();
  
  let error = false;

  const [data, setData] = useState(songs)
  let generated = false;
  const seed = {
    'location': 2,
    'id': '0dDG6oBNPPkQHKE8UC5Mc1'
  }
  
  let key = 'BQBsQKUZ3NGnyPlcyuY1lgFDkcmuYpZV0ecw54n9g1vaXPWtRJ4U6daNgDqGOPV0notpgauQwNvJxvopHh8wDeBIk0X5MD9ggsfKoD50Cokxg15inOUzeXzO76stzvyuZGb0hNz1kfWMC5WBMCfZr0b1pNaagycbG1UY1w4tcj199wfDtC9UO4LVo3IQv_kMWvRr6vbmdI6XQAVWmIWo9dvozRijtZ3-PKfBaI2gLZzdNITatv0'
  
  let thisplaylist = new Array(data.length).fill(0)

  data.forEach(d => {
    d.id = d.id
  })


  function getRecommendations(i, start,  end, k){
    return new Promise((resolve, reject) => {

      const seeds = thisplaylist.slice(start, end)
      let seed_tracks = "seed_tracks="+seeds.join(',')
      let metricList = [];
      for (let metric in k){
        metricList.push(metric+'='+k[metric])
      }
      let metricStr = metricList.join('&')

      requestRecs(seed_tracks, metricStr)
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
    const seedIndex = SEED_LOC_MAIN-1;
    let features;
    console.log(data)
    let targets= {
      'target_danceability': data.map((d) => d.danceability),
      'target_energy': data.map((d) => d.energy),
      'target_valence': data.map((d) => d.valence),
      'target_instrumentalness': data.map((d) => d.instrumentalness)
    }
    
    thisplaylist[seedIndex] = SEED_URI_MAIN.split(':')[2];
    getFeatures(seed['id'])
    .then((res) => {
      features = res.data
      console.log("FEATURES:")
      console.log(features);
      console.log(targets)
      for (let metric in targets){

        if (metric == 'target_instrumentalness') continue
        // console.log(features[metric.split('_')[1]]);
        // console.log((targets[metric][seedIndex])/100);
        // divide by 100? 
        const offset = (features[metric.split('_')[1]]) - (targets[metric][seedIndex])
        console.log(metric +" offset =" +offset)

        // console.log("OFFSET: "+offset);
        // Prevent huge fluctuation in value, especially above 1
        targets[metric] = (offset > 0) ? targets[metric].map((val) => {
          return val-offset
        }) : targets[metric].map((val) => {
          return val+offset
        })

      }
      console.log(targets)
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
    .catch((err) => {
      error = true;
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
      danceability: Math.max(data[data.length-1].danceability-.05, 0.25),
      energy: Math.max(data[data.length-1].energy-0.05, 0.25),
      instrumentalness: Math.max(data[data.length-1].instrumentalness-0.05, 0.25),
      valence: Math.max(data[data.length-1].valence-0.05, 0.25)
    }

    setData([...data, newTrack])
  }

  function removeSong(){
    if (data.length == 1)return
    data.pop();
    setData([...data]);
  }



  function savePlaylist(){

    // if (!generated)return

  createPlaylist(PLAYLIST_NAME_MAIN)
    .then((response) => {
      const playlistId = response.data.id
      const uris = thisplaylist.join(',')
      addSongstoPlaylist(playlistId, uris)
      // .then((res) => {
        // TODO show confirmation that a user is done
      // })

    });


  }

  function handleChange(event) {
    const eventId = event.target.id
    if (eventId === 'name-input')PLAYLIST_NAME_MAIN = event.target.value;
    else if (eventId === 'seed-location')SEED_LOC_MAIN = event.target.value;
    else if (eventId === 'seed-id')SEED_URI_MAIN = event.target.value
    // else if(eventId === 'seed-id')

    // if((eventId).equals('name-input'))pname = event.target.value;
    // if('name-input'.equals(event.target.id))pname = event.target.value;

  }

  function display(){
    console.log(data)
  }
  return (
      <Container id='view-area'>
        <Row>
          <Column id='parameter-col'>
            <input type="text" id="name-input" placeholder="my special playlist" onChange={handleChange}></input>
            <input type="text" id="seed-id" placeholder="spotify:track:xxxxxxx" onChange={handleChange}></input>
            <input type="number" id="seed-location" min="1" max={data.length} onChange={handleChange} value={1}></input> 
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
            <button onClick={login}> Login to Spotify </button>
            <div>
            {error ?  <h3> 
                Token refreshing. Try again 
              </h3>: <h3> All good</h3>

            }
            </div>
            <button onClick={display}> Test </button>


          </Column>
        </Row>
      </Container>
  );
}



var songs = [
  {
    id: "xxx1",
    danceability: .65,
    energy: .65,
    valence: .65, 
    instrumentalness: .65
  },
  {
    id: "xxx2",
    danceability: .75,
    energy: .75,
    valence: .75, 
    instrumentalness: .75
  },
  {
    id: "xxx3",
    danceability: .85,
    energy: .85,
    valence: .85, 
    instrumentalness: .85
  },
  {
    id: "xxx4",
    danceability: .85,
    energy: .85,
    valence: .85, 
    instrumentalness: .85
  },
  {
    id: "xxx5",
    danceability: .72,
    energy: .72,
    valence: .72, 
    instrumentalness: .72
  },
  {
    id: "xxx6",
    danceability: .65,
    energy: .65,
    valence: .65, 
    instrumentalness: .65
  },
]

export default PlaylistBuilder;