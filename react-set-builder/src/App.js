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
  const key = 'BQDTKAPCWd89FAdUKXKZuIi71SYnbwtl4jDMgTXbqVxTq3VJcZrDspOp2XUJQIeR8HLJ99OG3BV8c9C8DJ2I6SgCMsCJmhwiGvGjr8hITOZwC1-3qt5UmRKUq_PSuG1NtZ9-FgzZWhQS0aCoh7EHDOMc7XphrzG9lx8hOrkQ7E2jIJV4VhDoUh_-EsbQATBjfzZkW91sTyvr7bkrAoYgzIeLswdOMqt87pBoq15JzowdkCu1w5Q'
  
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

  function getRecommendations(seedIndex, i,  num_seeds, k){
    return new Promise((resolve, reject) => {

      const seeds = thisplaylist.slice(seedIndex, seedIndex+num_seeds)
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
        if (recs.length == 0)console.log("Could not find recommendations");

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
        const num_seeds = Math.min(i-seedIndex, 5)

        promise = addToChain(promise, i, seedIndex, num_seeds, k)
       

      }
    })
    

  }

  function addToChain(chain, i, seedIndex, num_seeds, k){
    return chain.then(() => {
      return getRecommendations(seedIndex, i, num_seeds, k);
    })
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