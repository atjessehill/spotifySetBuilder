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
import {getFeatures, requestRecs, login, createPlaylist, addSongstoPlaylist, search } from '../services/SpotifyCalls';
import Datagen from '../services/Datagen';
import {Variance, Mean} from '../services/Helper';

let PLAYLIST_NAME_MAIN = 'TEST PLAYLIST FROM setBuilder';
let SEED_LOC_MAIN = 2;
let SEED_URI_MAIN = 'spotify:track:5tIhRlNkApQJoDA8zhOBUY';
let FEATURE_TYPE = 'target_danceability'
let PLAYLIST_LENGTH = 6;
let THIS_PLAYLIST;

function PlaylistBuilder(props) {

  const cookies = new Cookies();
  let searchItems;
  let error = false;

  const [data, setData] = useState(Datagen())
  let generated = false;

  function getRecommendations(i, start,  end, k){
    return new Promise((resolve, reject) => {

      const seeds = THIS_PLAYLIST.slice(start, end)
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
          if(!THIS_PLAYLIST.includes(recs[track].id)){
            THIS_PLAYLIST[i] = recs[track].id;
          }
        }
        resolve();

        
      })

    })

  }

  function getIndex(adjusted_data, index){
    // Return an array of indexes to indicate which indexes to sample from

    // return [1, 10, 15, index, 30, 50]

    let slopes = {}
    let limit = 0.1;
    let newPoints = [];
    let toRemove = [];
    let updated_vals = [];
    for(let i=1; i<adjusted_data.length; i++){
      if(adjusted_data[i-1] - adjusted_data[i] === 0)slopes[i] = Number.MAX_VALUE;
      else {
        slopes[i] = adjusted_data[i-1] - adjusted_data[i]
      }

    }
    newPoints.push(0);    

    for(let i=Object.keys(slopes).length-2; i> 0; i--){
      // console.log(Math.abs(slopes[i] - slopes[i+1]))
      if(Math.abs(slopes[i] - slopes[i+1]) < limit){ 
        toRemove.push(i);
      }

    }

    console.log(Object.keys(slopes).length);

    for(let i=0; i<toRemove.length; i++){
      delete slopes[toRemove[i]]
    }
    
    for(const [key, value] of Object.entries(slopes)){
      newPoints.push(Number(key));
    }

    newPoints.map((d) => {
      updated_vals.push(adjusted_data[d])
    })

 

    console.log(newPoints);
    console.log(updated_vals);
    
  }

  function generate(){
    getIndex(data, 25);
    return

    let features;
    let seedIndex;
    let sampleIndex;
    let adjusted_data;
    THIS_PLAYLIST = new Array(PLAYLIST_LENGTH).fill(0);

    getFeatures(SEED_URI_MAIN.split(':')[2])
    .then((res) => {
      const songFeature = FEATURE_TYPE.split('_')[1]
      const features = res.data
      console.log(res);
      console.log(features[songFeature])
      let closestVal = 100;

      for(let i=0; i<data.length; i++){

        let diff = Math.abs(data[i]-features[songFeature]);
        // console.log(i + ':' +diff + ' :'+closestVal);

        if (diff < closestVal){
          closestVal = diff;
          seedIndex = i
        }
      }
      const offset = data[seedIndex]-features[songFeature];

      adjusted_data = data.map((d) => {
        return (offset >= 0) ? d+offset:d-offset
      })


      // Determine two numbers, the # of points

      sampleIndex = getIndex(adjusted_data, seedIndex)

      for(let i=0; i<sampleIndex.length; i++){
        if(seedIndex === sampleIndex[i])seedIndex=i;
      }

      console.log(sampleIndex);
      console.log(seedIndex);
      THIS_PLAYLIST[seedIndex] = SEED_URI_MAIN.split(':')[2];


      // let pts = getIndex(adjusted_data, seedIndex).map((d) => {
      //   return adjusted_data[d]
      // })    

      // TODO SAMPLE POINTS

        

    })
    .then(() => {
      let promise = Promise.resolve()

      for(let i=seedIndex+1; i<sampleIndex.length; i++){
        const k = {}
        k[FEATURE_TYPE] = adjusted_data[sampleIndex[i]]
        const end = seedIndex + Math.min(i-seedIndex, 5);
        promise = addToChain(promise, i, seedIndex, end, k);

      }

      for(let i=seedIndex-1; i>-1; i--){
        const k = {}
        k[FEATURE_TYPE] = adjusted_data[sampleIndex[i]];
        let x = THIS_PLAYLIST.length-i
        x = (x >=5) ? 5 : x
        const start = i+1;
        const end = i+x+1


        promise = addToChain(promise, i, start, end, k)
        
      }

      promise.finally(() => {
        generated=true;
        props.history.push({
          pathname: '/playlist',
          state: {
            playlist: THIS_PLAYLIST
          }
        })

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

  function getRandom(arr, n, index){
    // FOR DEVELOPMENT PURPOSES ONLY, SELECT first N points from the data array
    return arr.slice(index, index+n)

  }


  function handleChange(event) {
    const eventId = event.target.id
    if (eventId === 'name-input')PLAYLIST_NAME_MAIN = event.target.value;
    else if (eventId === 'seed-location')SEED_LOC_MAIN = event.target.value;
    else if (eventId === 'seed-id')SEED_URI_MAIN = event.target.value;
    
    // search(event.target.value)
    //   .then((res) => {
    //     searchItems = res.map((d) => <option key={d.name}>{d.name}</option>);
    //   })
    //   console.log(searchItems);
    

  }

  return (
      <Container id='view-area'>
        <Row>
          <Column id='parameter-col'>
            <input type="text" id="seed-id" placeholder="spotify:track:xxxxxxx" onChange={handleChange}></input>
            <br/>
            <button onClick={generate}> generate </button>
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