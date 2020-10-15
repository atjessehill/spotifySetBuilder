import React, { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import {select, line, curveCardinal, axisBottom, axisRight, scaleLinear } from "d3";
import './App.css';


function App() {
  const [data, setData] = useState([25, 30, 45, 60, 20, 75])

  const svgRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);

    const xScale = scaleLinear()
      .domain([0, data.length-1])
      .range([0, 300])


    const yScale = scaleLinear()
      .domain([0, 75])
      .range([150, 0]) 

    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat(index => index + 1);
    svg.select(".x-axis")
      .style("transform", "translateY(150px)")
      .call(xAxis);

    const myLine = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal);


    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      .style("transform", "translateX(300px)")
      .call(yAxis)
    

    svg.selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "red");
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
    </React.Fragment>
  );
}

export default App;