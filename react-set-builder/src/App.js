import React, { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import {select, line, curveCardinal } from "d3";
import './App.css';


function App() {
  const [data, setData] = useState([25, 30, 45, 60, 20, 75])

  const svgRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);
    const myLine = line()
      .x((value, index) => index * 50)
      .y(value => 150 - value)
      .curve(curveCardinal);
    // svg
    //   .selectAll("circle")
    //   .data(data)
    //   .join("circle")
    //   .attr("r", value => value)
    //   .attr("cx", value => value * 2)
    //   .attr("cy", value => value *2)
    //   .attr("stroke", "red")
    svg.selectAll("path")
      .data([data])
      .join("path")
      .attr("d", value => myLine(value))
      .attr("fill", "none")
      .attr("stroke", "red");
    }, [data])

  return (
    <React.Fragment>
      <svg ref={svgRef}>
        <path d="M0, 150 100, 100 150, 120" stroke="blue" fill="none" />
      </svg>
      <br/>
      <button onClick={() => setData(data.map(value => value + 5))}> 
        Update data
      </button>
      <button onClick={() => setData(data.filter(value => value <= 35))}> 
        Filter data
      </button>
    </React.Fragment>
  );
}

export default App;