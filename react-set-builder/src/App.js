import React, { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import {select, axisBottom, axisRight, scaleLinear, scaleBand } from "d3";
import './App.css';


function App() {
  const [data, setData] = useState([25, 30, 45, 60, 20, 75])

  const svgRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current);
    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, 300])
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, 100])
      .range([150, 0]);

    const colorScale = scaleLinear()
      .domain([75, 150])
      .range(["green", "red"])
      .clamp(true);

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

    svg.selectAll("myline")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", (value, index) => xScale(index))
      .attr("x2", (value, index) => xScale(index))
      .attr("y1", (value, index) => {
        console.log(yScale(value));
        return yScale(value)
      })
      .attr("y2", yScale(0))
      .attr("stroke", "red");

    svg.selectAll("myCircle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (value, index) => xScale(index))
      .attr("cy", (value, index) => yScale(value))
      .attr("r", "4")
      .style("fill", "blue")
      .attr("stroke", "black");

    // svg.selectAll(".bar")
    //   .data(data)
    //   .join("rect")
    //   .attr("class", "bar")
    //   .style("transform", "scale(1, -1)")
    //   .attr("x", (value, index) => xScale(index))
    //   .attr("y", -150)
    //   .attr("width", xScale.bandwidth())
    //   .on("mouseenter", function(event, value) {
    //     const index = svg.selectAll(".bar").nodes().indexOf(this);
    //     svg.selectAll(".tooltip")
    //       .data([value])
    //       .join((enter) => enter.append("text").attr("y", yScale(value) - 4))
    //       .attr("class", "tooltip")
    //       .text(value)
    //       .attr("x", xScale(index))
    //       .transition()
    //       .attr("y", yScale(value) -8)
    //       .attr("opacity", 1);
    //   })
    //   .on("mouseleave", () => svg.select(".tooltip").remove())
    //   .transition()
    //   .attr("fill", colorScale)
    //   .attr("height", value => 150 - yScale(value));

    
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

export default App;