import React, { useState, useRef, useEffect } from 'react';
import {select, scaleLinear, line, curveCardinal, drag, getContext} from "d3";
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
    console.log(data);
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(() => {
        const svg = select(svgRef.current)

        if (!dimensions) return;       


        // const drg = drag()
        //   .on("start", dragStart)
        //   .on("drag", dragged)
          
        svg.call(
          drag()
          .on('drag', dragged)
          .on('end', dragEnd)
        )

        // const context = svg.node.getContext('2d')
        // var d = drag()
        //   // .origin((d) => d)
        //   .on('start', dragged)
        //   .on('drag', dragged)

        const xScale = scaleLinear()
            .domain([0, data.length-1])
            .range([0, dimensions.width])

        const yScale = scaleLinear()
            .domain([1, 100])
            .range([dimensions.height, 0])

        const myLine = line()
            .x((value, index) => xScale(index))
            .y(value => yScale(value))
            .curve(curveCardinal)

        function dragSubject(){
          let subject;
          console.log();
          console.log("dragsubject");
        }

        function click(event, d){
          console.log("click")
          select(this)
            .attr("fixed", true);
        }
    
        function dragged(event, d){
          const index = Math.round(xScale.invert(event.x))
          data[index] = data[index] - event.dy
          console.log(data);

          // select(this)
          //   .attr("fixed", true)
        }
    
        function dragEnd(event, d) {

        }

        // var rects = svg.selectAll('.bar')
        //   .data(data)
        //   .attr('height', 25)
        //   .attr('width', 10)
        //   .attr("class", "bar")
        //   .attr('fill', 'red')
        //   .style("transform", "scale(1, -1)")
        //   .attr("x", (value, index) => xScale(index))
        //   .attr("y", -150)
        //   .attr("width", 1)
        //   .attr("height", value => yScale(value))
        //   .enter();
          
        // const xScale = scaleLinear()
        //   .domain([1, 100])
        //   .range([0, dimensions.width])
        // //   .padding(0.5);
    
        // const yScale = scaleLinear()
        //   .domain([0, 100])
        //   .range([dimensions.height, 0]);
       
        // var bisect = bisector((d) => {
        //     return d.x
        // }).left;

        svg
            .selectAll("path")
            .data([data])
            .join("path")
            .attr("d", value => myLine(value))
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 5)
    

          
        function clampheight(x, lo){
            return x
        }
        function clamp(x, lo, hi){
          return x < lo ? lo : x > hi ? hi : x;
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

export default LineGraph;