import React, { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import {select, axisBottom, axisRight, scaleLinear, scaleBand, drag, keys, forceSimulation, create, forceManyBody, forceCenter} from "d3";
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Column from 'react-bootstrap/CardColumns';
import Column from 'react-bootstrap/Col';


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

  const svgRef = useRef();
  useEffect(() => {
    // const svg = select(svgRef.current)
    const svg = select("#chart-area").append("svg")
      // .attr("viewBox", [0, 0, 500, 500]);
      .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
    
    const g = svg.append("g")
      // .attr("transform",`translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

    const xScale = scaleBand()
      .domain(data.map((d) => d.id))
      .range([0, 300])
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, 100])
      .range([100, 0]);

    const xAxis = axisBottom(xScale)
      .ticks(data.length)
    // svg.select(".x-axis")
    //   .style("transform", `translateY(${(HEIGHT - MARGIN.TOP - MARGIN.BOTTOM)/2}px)`)
    //   .call(xAxis);

    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      // .style("transform", `translateY(${(WIDTH - MARGIN.LEFT - MARGIN.RIGHT)/2}px)`)
      .attr("align", "center")
      .call(yAxis)
    // const drg = drag().on("start", dragstart).on("drag", dragged);

    const node = g
      .selectAll(".node")
      .data(data)
      .join("circle")
      .attr("r", 12)
      .attr("class", "node")
      // .attr("fixed", true)


    const link = g
      .selectAll(".stick")
      .data(data)
      .join("line")
      .attr("class", "stick")
      .attr("stroke", "grey")
      // .classed("node", true)
      // .classed("fixed", d => d.value !== undefined);

    const simulation = forceSimulation()
      .nodes(data)
      .force("charge", forceManyBody())
      // .force("center", forceCenter(100, 50))
      .on("tick", tick);
    
    const drg = drag()
      .on("start", dragStart)
      .on("drag", dragged);

    node.call(drg).on("click", click);

    function tick(){
        node
          .attr("cx", (d) => xScale(d.id))
          .attr("cy", (d) => yScale(d.value))
          .attr("r", 4)
        link
          .attr("x1", (d) => xScale(d.id))
          .attr("y2", (d) => yScale(d.value)+6)
          .attr("x2", (d) => xScale(d.id))
          .attr("y1", (d) => yScale(0))
        }

      
    function clamp(x, lo, hi){
      return x < lo ? lo : x > hi ? hi : x;
    }

    function click(event, d){
      delete d.fy;
      select(this)
        .attr("fixed", true);
      simulation.alpha(1).restart();
    }

    function dragStart(){
      select(this)
        .attr("fixed", true)
    }

    function dragged(event, d) {
      d.value = clamp(d.value-event.dy, 10, 100)
      simulation.alpha(1).restart();
    }

    }, [data])

  return (
    <React.Fragment>
      <Container id='view-area'>
        <Row>
          <Column id='parameter-col'>
            <h1> Col 1</h1>
          </Column>
          <Column md={7} id='chart-col'>
          <div id="chart-area">

          </div>
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