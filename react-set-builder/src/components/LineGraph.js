import React, { useState, useRef, useEffect } from 'react';
import {select, axisBottom, axisRight, scaleLinear, bisector, line} from "d3";
import '../App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Column from 'react-bootstrap/CardColumns';
import Column from 'react-bootstrap/Col';
import ResizeObserver from "resize-observer-polyfill";
import Datagen from '../services/Datagen';

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
    data = Datagen();
    console.log(data);
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);


    useEffect(() => {
        const svg = select(svgRef.current)

        if (!dimensions) return;       

        const xScale = scaleLinear()
          .domain([1, 100])
          .range([0, dimensions.width])
        //   .padding(0.5);
    
        const yScale = scaleLinear()
          .domain([0, 100])
          .range([dimensions.height, 0]);
       
        var bisect = bisector((d) => {
            return d.x
        }).left;

        svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line()
                .x((d) => xScale(d.x))
                .y((d) => yScale(d.y))
            )
    
          
        function clampheight(x, lo){
            return x
        }
        function clamp(x, lo, hi){
          return x < lo ? lo : x > hi ? hi : x;
        }
    
        // function click(event, d){
        //   delete d.fy;
        //   select(this)
        //     .attr("fixed", true);
        //   simulation.alpha(1).restart();
        // }
    
        // function dragStart(){
        //   select(this)
        //     .attr("fixed", true)
        // }
    
        // function dragged(event, d) {

        //   d.danceability = clamp((d.danceability-event.dy/100), 0.1, 1)
        //   simulation.alpha(1).restart();
        // }
    
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

export default LineGraph;