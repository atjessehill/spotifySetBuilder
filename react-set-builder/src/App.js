import React, { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import {select, axisBottom, axisRight, scaleLinear, scaleBand, drag, keys, forceSimulation, create, forceManyBody, forceCenter} from "d3";
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Column from 'react-bootstrap/CardColumns';
import Column from 'react-bootstrap/Col';
import Lolipop from './Lolipop';
import axios from 'axios';

function App() {

  const [data, setData] = useState(songs)
  const seed = {
    'location': 2,
    'id': '0dDG6oBNPPkQHKE8UC5Mc1'
  }
  const key = 'BQDd_uJXqVjmnEDlHdiD3GEyfcrDpcJnFA1b1N90dzWEH_7s6uecbyvQqAkV_fpkSeqA2g1JKwpyLgj8ht_bWlrh85uFv0gnWz6tGspa77M6bfHVg63tp1uFdM9qdeXYG99qBYpC1fLjKx3-D1gnF85Sm6UGIlDzm1iDxqM-6HyQENCShFSVQme2tb9CWpCEHkVTcEFu9DpY-4OK_NINx3xDCLk_jrNjvYnYAKeETsbX32NlYSo'

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

  async function getRecommendations(seeds, k){

    console.log(seeds)
    let seed_tracks = "seed_tracks="+seeds.join(',');
    let metricList = [];
    for (let metric in k){
      metricList.push(metric+'='+k[metric])

    }
    let metricStr = metricList.join('&')
    return await axios.get(`https://api.spotify.com/v1/recommendations/?&${seed_tracks}&${metricStr}`, {
      headers: {
        'Authorization': `Bearer ${key}`,
      }
    })
    .then((res) => {
      return res
    })

  }

  function generate(){

    const length = data.length;
    const seedIndex = seed['location']
    let features;

    let playlist = new Array(length).fill(0)
    playlist[seedIndex] = seed['id']
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
      for(let i=seedIndex+1; i<length; i++){

        const k = {}
        for(let metric in targets){
          k[metric] = targets[metric][i]
        }
        const num_seeds = Math.min(i-seedIndex, 5)
        const trackseeds = playlist.slice(seedIndex,seedIndex+num_seeds)

        getRecommendations(trackseeds, k)
          .then((res) => {
            let recommendations = res.data.tracks;
            // console.log(recommendations)
            if (recommendations.length == 0) console.log("Nothing found")
            for(let track in recommendations){
              if(!playlist.includes(recommendations[track].id)){
                playlist[i] = recommendations[track].id
                console.log(playlist)

                break
              }
            }
          })        

      }
    })
    
    
        // const x = length-i
        // x = (x >=5 ) ? 5 : x
        // const trackseeds = 

        // console.log(k)





  }

  function addSong(){

    const newTrack = {
      id: "xx"+(data.length+1).toString(),
      value: Math.max(data[data.length-1].value-5, 25)
    }

    setData([...data, newTrack])
  }

  function removeSong(){
    if (data.length == 1)return
    data.pop();
    setData([...data]);
  }

  return (
    <React.Fragment>
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

          </Column>
          <Column id='chart-col'>
            <Lolipop data={data} />
          </Column>
          <Column id='right-col'>
            <h1> Col 3</h1>
          </Column>
        </Row>
      </Container>
    </React.Fragment>
  );
}


var songs = [
  {
    id: "xxx1",
    value: 65
  },
  {
    id: "xxx2",
    value: 75
  },
  {
    id: "xxx3",
    value: 85
  },
  {
    id: "xxx4",
    value: 78
  },
  {
    id: "xxx5",
    value: 72
  },
  {
    id: "xxx6",
    value: 65
  },
]

let danceability = [.60, .65, .70, .92, .73, .65]
let energy = [.50, .60, .65, .82, .65, .50]
let valence = [.75, .60, .65, .75, .65, .65]
let instrumentalness = [1.0, 0.0, 0.0, 1.0, 0.0, 1.0]

let targets= {
  'target_danceability': danceability,
  'target_energy': energy,
  'target_valence': valence,
  'target_instrumentalness': instrumentalness
}


export default App;