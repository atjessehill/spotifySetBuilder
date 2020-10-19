import React, { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import {select, axisBottom, axisRight, scaleLinear, scaleBand, drag, keys, forceSimulation, create, forceManyBody, forceCenter} from "d3";
import './App.css';



function App() {
  const [data, setData] = useState(songs)
  data.forEach(d => {
    d.id = d.id
  })

  const svgRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current)
      .attr("viewBox", [0, 0, 500, 500]);

    const xScale = scaleBand()
      .domain(data.map((d) => d.id))
      .range([0, 300])
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, 100])
      .range([100, 0]);

    const xAxis = axisBottom(xScale)
      .ticks(data.length)
    svg.select(".x-axis")
      .style("transform", "translateY(150px)")
      .call(xAxis);

    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      .style("transform", "translateX(300px)")
      .call(yAxis)
    // const drg = drag().on("start", dragstart).on("drag", dragged);


    const node = svg
      .selectAll(".node")
      .data(data)
      .join("circle")
      .attr("r", 12)
      .attr("class", "node")
      .attr("fixed", true)
      // .classed("node", true)
      // .classed("fixed", d => d.value !== undefined);

    const simulation = forceSimulation()
      .nodes(data)
      .force("charge", forceManyBody())
      .force("center", forceCenter(100, 50))
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
      d.value = clamp(d.value-event.dy, 0, 100)
      simulation.alpha(1).restart();
    }

    }, [data])

  return (
    <React.Fragment>
      <svg ref={svgRef}>
        <g className = "x-axis" />
        <g className = "y-axis" />
      </svg>
      <br/>
      <br></br>
      <br>
      </br>
      <button onClick={() => setData(data.map(value => value + 5))}> 
        Update data
      </button>
      <button onClick={() => setData(data.filter(value => value <= 35))}> 
        Filter data
      </button>
      <button onClick={() => setData([...data, Math.round(Math.random()*100)])}> 
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