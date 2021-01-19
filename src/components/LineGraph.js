import React, { useState, useRef, useEffect } from 'react';
import {select, scaleLinear, line, curveCatmullRom, drag, curveCatmullRomClosed, curveCatmullRomOpen, color} from "d3";
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

function LineGraph({data, featureType}) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const lineColor = featureType == 'target_danceability' ? "#FF4732" : "#17B350"
    let label = featureType.split('_')[1];

    useEffect(() => {
      const svg = select(svgRef.current)

        if (!dimensions) return;       

         
        // svg.append('rect')
        //   .attr('x', 0)
        //   .attr('y', 0)
        //   .attr('width', dimensions.width)
        //   .attr('height', dimensions.height+20)
        //   .attr('color', 'red');
        const _ = featureType.split('_')[1];
        label = _.charAt(0).toUpperCase()+_.slice(1)

        svg.select(".featureLabel").remove()
        svg.select(".startLabel").remove()
        svg.select(".endLabel").remove()
        svg.select(".borderLine").remove()

        svg.append("line")
          .attr("class", "borderLine")
          .style("stroke", color(lineColor))
          .style("stroke-width", 2)
          .attr("x1", 0)
          .attr("y1", dimensions.height+20)
          .attr("x2", dimensions.width)
          .attr("y2", dimensions.height+20);

        svg.append("text")
          .attr("class", "startLabel")
          .attr("text-anchor", "start")
          .attr("x", 0)
          .attr("y", dimensions.height+45)
          .attr("fill", "#999999")
          .attr("font-family", "ubuntu")
          .attr("font-size", "10px")
          .attr("line-height", "14px")
          .attr("letter-spacing", "0.3px")
          .attr("font-weight", "200")
          .text("Start of Playlist → ")

        svg.append("text")
          .attr("class", "endLabel")
          .attr("text-anchor", "end")
          .attr("x", dimensions.width)
          .attr("y", dimensions.height+45)
          .attr("fill", "#999999")
          .attr("font-family", "ubuntu")
          .attr("font-size", "10px")
          .attr("line-height", "14px")
          .attr("letter-spacing", "0.3px")
          .attr("font-weight", "200")
          .text("End of Playlist")

        svg.append("text")
          .attr("class", "featureLabel")
          .attr("x", 0)
          .attr("y", -10)
          .attr("text-anchor", "end")
          .attr("fill", "#999999")
          .attr("font-family", "ubuntu")
          .attr("font-size", "10px")
          .attr("line-height", "14px")
          .attr("letter-spacing", "0.3px")
          .attr("font-weight", "200")
          .text(`${label} →`)
          .attr("transform", "rotate(270)")

          // font-family: ubuntu;
          // font-size: 10px;
          // font-weight: 200;
          // line-height: 14px;
          // letter-spacing: 0.3px; 


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
            .curve(curveCatmullRomOpen)

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
          .attr("stroke", lineColor)
          .attr("stroke-width", 4)

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
            .attr("stroke", lineColor)
            .attr("stroke-width", 4)
              
        function clamp(x, lo, hi){
          return x < lo ? lo : x > hi ? hi : x;
        }

        }, [data, dimensions, featureType])

        return (

          <div id="graph-block" class="metric-blocks">
          <div>
            <div class="numbered-disc orange-bg float-to-left">3</div><p class="title-text float-to-left">Playlist trajectory</p>
          </div>
          <div ref={wrapperRef}  style={{marginTop: "4rem"}}>
                <svg ref={svgRef} onMouseDown={LineGraph.handleMouseDown}>
                    <g className="x-axis"/>
                    <g className="y-axis"/>
                </svg>
            </div>
            <div style={{marginTop: "25px"}}></div>
            <p className="reduntant-text grey1 stick-to-bottom" style={{margin: "40px"}}>Click and drag the line to match how the <span style={{color:lineColor}}> {label} </span> will evolve over time!</p>

        </div>



        )

}

export default LineGraph;