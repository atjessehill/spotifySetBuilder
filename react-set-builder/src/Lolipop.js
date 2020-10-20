import React, { useState, useRef, useEffect } from 'react';
import logo from './logo.svg';
import {select, axisBottom, axisRight, scaleLinear, scaleBand, drag, keys, forceSimulation, create, forceManyBody, forceCenter} from "d3";
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Column from 'react-bootstrap/CardColumns';
import Column from 'react-bootstrap/Col';
import ResizeObserver from "resize-observer-polyfill";

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 50, BOTTOM: 130};
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

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
        // const svg = select(svgRef.current)
        const svg = select(svgRef.current);
        console.log(dimensions);
        if (!dimensions) return;
        // console.log(dimensions.height);
          // .attr("viewBox", [0, 0, 500, 500]);
        //   .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        //   .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
        
        // const g = svg.append("g")
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
        svg.select(".x-axis")
        //   .style("transform", `translateY(${(HEIGHT - MARGIN.TOP - MARGIN.BOTTOM)/2}px)`)
          .call(xAxis);
    
        const yAxis = axisRight(yScale);
        svg
          .select(".y-axis")
          // .style("transform", `translateY(${(WIDTH - MARGIN.LEFT - MARGIN.RIGHT)/2}px)`)
          .attr("align", "center")
          .call(yAxis)
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