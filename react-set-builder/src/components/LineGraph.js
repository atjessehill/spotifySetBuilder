import React, { useState, useRef, useEffect } from 'react';
import {select, scaleLinear, line, curveCardinal, drag} from "d3";
import '../App.css';
// import Column from 'react-bootstrap/CardColumns';
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

function LineGraph({data}) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(() => {
        const svg = select(svgRef.current)

        if (!dimensions) return;       

         
        svg.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', dimensions.width)
          .attr('height', dimensions.height)
          .attr('color', 'red');

        svg.call(
          drag()
          .on('start', click)
          .on('drag', dragged)
          .on('end', dragEnd)
        )

        const xScale = scaleLinear()
            .domain([0, data.length-1])
            .range([0, dimensions.width])
        
        const yScale = scaleLinear()
            .domain([0.1, 1.0])
            .range([dimensions.height, 0])

        const myLine = line()
            .x((value, index) => xScale(index))
            .y(value => yScale(value))
            .curve(curveCardinal)

        function click(event, d){
          select(this)
            .attr("fixed", true);
        }
   
        function dragged(event, d){
          
          const index1 = clamp(Math.round(xScale.invert(event.x)), 0, 100);
          const newY = 1.0-clamp(event.y/100, 0.0, 1.0);
          // const val1 = clamp(data[index1] - event.dy, 0, 100);
          // console.log("Changing index" +index1 + " from " + data[index1] + " to "+ val1)
          data[index1] = newY;
          
          svg
          .selectAll("path")
          .data([data])
          .join("path")
          .attr("d", value => myLine(value))
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 2)

          return

        }
    


        function dragEnd(event, d) {

        }

        svg
            .selectAll("path")
            .data([data])
            .join("path")
            .attr("d", value => myLine(value))
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 5)
              
        function clamp(x, lo, hi){
          return x < lo ? lo : x > hi ? hi : x;
        }

        }, [data, dimensions])

        return (
            <div ref={wrapperRef}  style={{marginBottom: "2rem", marginTop: "2rem"}}>
                <svg ref={svgRef} onMouseDown={LineGraph.handleMouseDown}>
                    <g className="x-axis"/>
                    <g className="y-axis"/>
                </svg>
            </div>
        )

}

export default LineGraph;