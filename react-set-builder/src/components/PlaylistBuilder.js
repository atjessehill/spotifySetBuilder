import React, { useState, useRef, useEffect } from 'react';
import '../App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Column from 'react-bootstrap/CardColumns';
import Column from 'react-bootstrap/Col';
import Lolipop from './Lolipop';
import LineGraph from './LineGraph';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {getFeatures, requestRecs, login, createPlaylist, addSongstoPlaylist } from '../services/SpotifyCalls';
import Datagen from '../services/Datagen';

let PLAYLIST_NAME_MAIN = 'TEST PLAYLIST FROM setBuilder';
let SEED_LOC_MAIN = 2;
let SEED_URI_MAIN = 'spotify:track:5tIhRlNkApQJoDA8zhOBUY';
let FEATURE_TYPE = 'target_danceability'
let PLAYLIST_LENGTH = 6;

function PlaylistBuilder() {
  const cookies = new Cookies();
  
  let error = false;

  const [data, setData] = useState(Datagen())
  let generated = false;

  let thisplaylist = new Array(data.length).fill(0)

  // data.forEach(d => {
  //   d.id = d.id
  // })


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
    let adjusted_data = data.map((d) => d/100);
    let features;
    let seedIndex;
    console.log(adjusted_data);
    // thisplaylist[seedIndex] = SEED_URI_MAIN.split(':')[2];
    getFeatures(SEED_URI_MAIN.split(':')[2])
    .then((res) => {
      const songFeature = FEATURE_TYPE.split('_')[1]
      const features = res.data
      console.log(res);
      console.log(features[songFeature])
      let closestVal = 100;
      // const closest = data.reduce((a, b) => {
      //   return Math.abs(b - features[songFeature]) < Math.abs(a - features[songFeature]) ? b:a;
      // })

      for(let i=0; i<adjusted_data.length; i++){

        let diff = Math.abs(adjusted_data[i]-features[songFeature]);
        // console.log(i + ':' +diff + ' :'+closestVal);

        if (diff < closestVal){
          closestVal = diff;
          seedIndex = i
        }
      }
      const offset = adjusted_data[seedIndex]-features[songFeature];

      adjusted_data = adjusted_data.map((d) => {
        return (offset >= 0) ? d+offset:d-offset
      })
      thisplaylist[seedIndex] = SEED_URI_MAIN.split(':')[2];

      // TODO SAMPLE POINTS
      
      
      // clamp(d+(Math.abs(adjusted_data[closestIndex]-features[songFeature])), 0, 1))
      // console.log(adjusted_data)
    })
    .then(() => {
      let promise = Promise.resolve()

      for(let i=seedIndex+1; i<adjusted_data.length; i++){
        const k = {}
        k[FEATURE_TYPE] = adjusted_data[i]
        const end = seedIndex + Math.min(i-seedIndex, 5);
        promise = addToChain(promise, i, seedIndex, end, k);

      }

      for(let i=seedIndex-1; i>-1; i--){
        const k = {}
        k[FEATURE_TYPE] = adjusted_data[i];
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

  function clamp(x, lo, hi){
    return x < lo ? lo : x > hi ? hi : x;
  }

  function addToChain(chain, i, start, end, k){
    return chain.then(() => {
      return getRecommendations(i, start, end, k);
    })
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

  function getRandom(){
    // FOR DEVELOPMENT PURPOSES ONLY, SELECT N Random points from the adjusted_data array


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

  return (
      <Container id='view-area'>
        <Row>
          <Column id='parameter-col'>
            <input type="text" id="name-input" placeholder="my special playlist" onChange={handleChange}></input>
            <input type="text" id="seed-id" placeholder="spotify:track:xxxxxxx" onChange={handleChange}></input>
            <br/>
            <button onClick={generate}> generate </button>
            <button onClick={savePlaylist}> Save Playlist </button>
          </Column>
          <Column id='chart-col'>
            <LineGraph data={data} />
          </Column>
          <Column id='right-col'>
            <button onClick={login}> Login to Spotify </button>
            <div>
            {error ?  <h3> 
                Token refreshing. Try again 
              </h3>: <h3> All good</h3>

            }
            </div>

          </Column>
        </Row>
      </Container>
  );
}

export default PlaylistBuilder;