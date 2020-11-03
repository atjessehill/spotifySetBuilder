import React, { useState, useRef, useEffect } from 'react';
import {select, axisBottom, axisRight, scaleLinear, scaleBand, drag, keys, forceSimulation, create, forceManyBody, forceCenter} from "d3";
import '../App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Column from 'react-bootstrap/CardColumns';
import Column from 'react-bootstrap/Col';
import ResizeObserver from "resize-observer-polyfill";


const useResizeObserver = (ref) => {
    const [dimensions, setDimensions] = useState(null);
    useEffect(() => {
      const observeTarget = ref.current;
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          setDimensions(entry.contentRect);
        });
      });
      resizeObserver.observe(observeTarget);
      return () => {
        resizeObserver.unobserve(observeTarget);
      };
    }, [ref]);
    return dimensions;
  };

function Lolipop({data}) {

    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);


    useEffect(() => {
        const svg = select(svgRef.current)

        if (!dimensions) return;       

        const xScale = scaleBand()
          .domain(data.map((d) => d.id))
          .range([0, dimensions.width])
          .padding(0.5);
    
        const yScale = scaleLinear()
          .domain([0, 100])
          .range([dimensions.height, 0]);
    
        // const xAxis = axisBottom(xScale).ticks(data.length)
        // svg.select(".x-axis")
        //     .style("transform", `translateY(${dimensions.height}px)`)
        //     .call(xAxis);
    
        // const yAxis = axisRight(yScale);
        // svg
        //   .select(".y-axis")
        //   .style("transform", `translateX(50px)`)
        //   .call(yAxis)
        // const drg = drag().on("start", dragstart).on("drag", dragged);
    
        const node = svg
          .selectAll(".node")
          .data(data)
          .join("circle")
          .attr("r", 12)
          .attr("class", "node")
          // .attr("fixed", true)
    
    
        const link = svg
          .selectAll(".stick")
          .data(data)
          .join("line")
          .attr("class", "stick")
          .attr("stroke", "red")
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
              .attr("cy", (d) => yScale(d.danceability))
              .attr("r", 4)
              // .attr("class", (d, index, i) => "node " + index.toString())
            link
              .attr("x1", (d) => xScale(d.id))
              .attr("y2", (d) => yScale(d.danceability)+6)
              .attr("x2", (d) => xScale(d.id))
              .attr("y1", (d) => yScale(0))
              // .attr("class", (d, index, i) => "link " + i.toString())

            }
    
          
        function clampheight(x, lo){
            return x
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
          d.danceability = clamp(d.danceability-event.dy, 10, 100)
          simulation.alpha(1).restart();
        }
    
        }, [data, dimensions])
    
        return (
            <div ref={wrapperRef} style={{marginBottom: "2rem", marginTop: "2rem"}}>
                <svg ref={svgRef}>
                    <g className="x-axis"/>
                    <g className="y-axis"/>
                </svg>
            </div>
        )

}

export default Lolipop;