import React, { useState, useRef, useEffect } from 'react';
import {select, scaleLinear, line, curveCardinal, curveCardinalOpen, drag, getContext, forceSimulation, forceManyBody} from "d3";
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
    let moveIndex;
    let dragCounter = 0;
    

    useEffect(() => {
        const svg = select(svgRef.current)

        if (!dimensions) return;       

         
        const rect = svg.append('rect')
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
            .curve(curveCardinalOpen)

        const myLine2 = line()
          .x((value, index) => xScale(index))
          .y(value => yScale(value))

        function dragSubject(){
          let subject;
          console.log();
          console.log("dragsubject");
        }

        function click(event, d){
          moveIndex = Math.round(xScale.invert(event.x));
          select(this)
            .attr("fixed", true);
        }

        function between(num, x1, x2){
          if (num>=x1 && num<x2){
            return true;
          }
          return false;
        }
    
        function dragged(event, d){
          
          const index1 = clamp(Math.round(xScale.invert(event.x)), 0, 100);
          const newY = 1.0-clamp(event.y/100, 0.0, 1.0);
          console.log(newY)
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

          dragCounter+=1;
          let modifyRange = 6; //dragCounter % 10; //5
          if(between(dragCounter, 0, 30))modifyRange = 2;
          else if(between(dragCounter, 30, 60))modifyRange = 3;
          else if(between(dragCounter, 60, 90))modifyRange = 4;
          else if(between(dragCounter, 90, 120))modifyRange = 5;

          // console.log(Math.abs(event.dy));
          if(event.dy == 0) return;
          const index = Math.round(xScale.invert(event.x))
          const val = clamp(data[moveIndex] - event.dy, 0, 100);
          if (val == 0) return;
          moveIndex = index;
          data[moveIndex] = val;
         
          for(let i=1; i<=modifyRange; i++){
            let change = val-(0.5*i);
            let changeIndex = moveIndex+i;

            if (changeIndex<=99){

              data[moveIndex+i] = clamp(change, 0, 100);;
            }

          }
          for(let i=modifyRange; i>=1; i--){

            let change = val-(0.5*i);
            data[moveIndex-i] = clamp(change, 0, 100);
          }



          svg
          .selectAll("path")
          .data([data])
          .join("path")
          .attr("d", value => myLine(value))
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 5)
        }
    


        function dragEnd(event, d) {
          console.log(dragCounter);
          dragCounter = 0;
        }

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

        function handleMouseDown(mouseEvent){
          console.log("mousedown");
        }
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