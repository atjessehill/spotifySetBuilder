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


        // const drg = drag()
        //   .on("start", dragStart)
        //   .on("drag", dragged)
          
        svg.call(
          drag()
          .on('start', click)
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
            // .curve(curveCardinalOpen)

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
          dragCounter+=1;
          console.log(dragCounter);
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
            let change = val-i;
            let changeIndex = moveIndex+i;

            if (changeIndex<=99){
              console.log("Changing "+data[moveIndex+i]+ " to "+change)

              data[moveIndex+i] = clamp(change, 0, 100);;
            }
            // let change = (event.dy > 0) ? val+i:val-i;//Math.abs(data[i]-val);


            // console.log(change)
            // if (change < 1){
            //   data[i] = (event.dy > 0) ? val+i : val-i;
            // }
          }
          for(let i=modifyRange; i>=1; i--){

            let change = val-i;
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

        console.log("here");
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