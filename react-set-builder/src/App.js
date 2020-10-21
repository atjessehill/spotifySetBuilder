import React, { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import {select, axisBottom, axisRight, scaleLinear, scaleBand, drag, keys, forceSimulation, create, forceManyBody, forceCenter} from "d3";
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Column from 'react-bootstrap/CardColumns';
import Column from 'react-bootstrap/Col';
import Lolipop from './Lolipop';


function App() {

  const [data, setData] = useState(songs)
  data.forEach(d => {
    d.id = d.id
  })

  function generate(){
    console.log("Generate");
    console.log(data);
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
              <button onClick={addSong}> + </button>
              <button onClick={removeSong}> - </button>
            </div>

          </Column>
          <Column id='chart-col'>
            <Lolipop data={data} />
          </Column>
          <Column id='right-col'>
            <h1> Col 3</h1>
          </Column>
        </Row>
      </Container>
      <button onClick={() => setData(data.map(value => value + 5))}> 
        Update data
      </button>
      <button onClick={() => generate()}> 
        Generate
      </button>
      <button onClick={addSong}> 
        Add data
      </button>
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

export default App;