import React, { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import {select, axisBottom, axisRight, scaleLinear, scaleBand, drag, keys, forceSimulation, create, forceManyBody, forceCenter} from "d3";
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Column from 'react-bootstrap/CardColumns';
import Column from 'react-bootstrap/Col';
import Lolipop from './Lolipop';


const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 50, BOTTOM: 130};
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

function App() {

  const [data, setData] = useState(songs)
  data.forEach(d => {
    d.id = d.id
  })

  function generate(){
    console.log("Generate");
    console.log(data);
  }
  return (
    <React.Fragment>
      <Container id='view-area'>
        <Row>
          <Column id='parameter-col'>
            <h1> Col 1</h1>
          </Column>
          <Column md={7} id='chart-col'>
            <Lolipop data={data} />
          </Column>
          <Column id='right-col'>
            <h1> Col 3</h1>
          </Column>
        </Row>
      </Container>

      {/* <svg ref={svgRef}>
        <g className = "x-axis" />
        <g className = "y-axis" />
      </svg>
      <br/>
      <br></br>
      <br>
      </br> */}
      <button onClick={() => setData(data.map(value => value + 5))}> 
        Update data
      </button>
      <button onClick={() => generate()}> 
        Generate
      </button>
      <button onClick={() => setData([...data, Math.round(Math.random()*100)] )}> 
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