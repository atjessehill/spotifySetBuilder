import React, { useState} from 'react';
import '../App.css';
import LineGraph from './LineGraph';
import Reference from './Reference';
import Scroller from './Scroller';
import {getFeatures, requestRecs, login, search } from '../services/SpotifyCalls';
import Datagen from '../services/Datagen';
import {Variance, Mean, stdDev, getRandInt, getRandArbitrary} from '../services/Helper';

let FEATURE_TYPE = 'target_danceability'
let PLAYLIST_LENGTH = 6;
let THIS_PLAYLIST;

class PlaylistBuilderC extends React.Component {

  constructor(props){
    super(props);
    const data = Datagen();

    this.state = {
      data: data,
      selected: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.generate = this.generate.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.addToChain = this.addToChain.bind(this);
    this.getRecommendations = this.getRecommendations.bind(this);
  }

  componentDidMount(){
      this.props.handler.current.changeBackground("Generate")
  }

  handleChange(event){
    if (event.type === "URI") this.setState({SEED_URI_MAIN:event.value, selected:true})
    if (event.type === "REMOVE") this.setState({selected:false})

  }

  getRecommendations(i, start,  end, k){
    return new Promise((resolve, reject) => {

      const seeds = this.state.THIS_PLAYLIST.slice(start, end)
      let seed_tracks = "seed_tracks="+seeds.join(',')
      let metricList = [];
      for (let metric in k){
        metricList.push(metric+'='+k[metric])
      }
      let metricStr = metricList.join('&')

      requestRecs(seed_tracks, metricStr)
      .then((res) => {
        let recs = res.data.tracks;
        if (recs.length === 0)console.log("Could not find recommendations"); // TODO add rejection and error checking

        for (let track in recs){
          if(!this.state.THIS_PLAYLIST.includes(recs[track].id)){
            const update = this.state.THIS_PLAYLIST;
            update[i] = recs[track].id;
            this.setState({THIS_PLAYLIST: update});
            // THIS_PLAYLIST[i] = recs[track].id;
          }
        }
        resolve();

        
      })

    })

  }

  generate(){
    this.props.popuphandler(false, true, false)

    const scroller = document.getElementById('scroller');
    console.log((scroller.scrollLeft/50*1)+6)
    PLAYLIST_LENGTH = (scroller.scrollLeft/50*1)+6

		this.setState({PLAYLIST_LENGTH: ((((scroller.scrollLeft)/50)*1)+6)})
        
    let sampledPoints = this.getIndex(this.state.data, 25);
    // DouglasPeucker(data, stdDev(data)+Mean(data))
    console.log(sampledPoints);
    let seedIndex;
    let sampleIndex;
    let adjusted_data;
    this.setState({THIS_PLAYLIST: new Array(PLAYLIST_LENGTH).fill(0)})

    getFeatures(this.state.SEED_URI_MAIN.split(':')[2])
    .then((res) => {
      const songFeature = FEATURE_TYPE.split('_')[1]
      const features = res.data
      console.log(res);
      console.log(features[songFeature])
      let closestVal = 100;

      for(let i=0; i<sampledPoints.length; i++){

        let diff = Math.abs(sampledPoints[i]-features[songFeature]);
        // console.log(i + ':' +diff + ' :'+closestVal);

        if (diff < closestVal){
          closestVal = diff;
          seedIndex = i
        }
      }
      const offset = sampledPoints[seedIndex]-features[songFeature];

      adjusted_data = sampledPoints.map((d) => {
        return (offset >= 0) ? d+offset:d-offset
      })


      // Determine two numbers, the # of points

      sampleIndex = this.getIndex(adjusted_data, seedIndex)

      for(let i=0; i<sampleIndex.length; i++){
        if(seedIndex === sampleIndex[i])seedIndex=i;
      }

      console.log(sampleIndex);
      console.log(seedIndex);
      const update = this.state.THIS_PLAYLIST;
      update[seedIndex] = this.state.SEED_URI_MAIN.split(':')[2];
      this.setState({THIS_PLAYLIST:update})
      console.log(adjusted_data);

      // let pts = getIndex(adjusted_data, seedIndex).map((d) => {
      //   return adjusted_data[d]
      // })    

      // TODO SAMPLE POINTS

        

    })
    .then(() => {
      let promise = Promise.resolve()

      for(let i=seedIndex+1; i<sampledPoints.length; i++){
        const k = {}
        k[FEATURE_TYPE] = sampledPoints[i]
        const end = seedIndex + Math.min(i-seedIndex, 5);
        promise = this.addToChain(promise, i, seedIndex, end, k);

      }

      for(let i=seedIndex-1; i>-1; i--){
        const k = {}
        k[FEATURE_TYPE] = sampledPoints[i];
        let x = this.state.THIS_PLAYLIST.length-i
        x = (x >=5) ? 5 : x
        const start = i+1;
        const end = i+x+1


        promise = this.addToChain(promise, i, start, end, k)
        
      }

      promise.finally(() => {
        this.props.popuphandler(false, false, false)
        this.props.history.push({
          pathname: '/playlist',
          state: {
            playlist: this.state.THIS_PLAYLIST,
            genre: document.getElementById("genre-text-id").innerHTML,
            uri: this.state.SEED_URI_MAIN
          }
        })

      })
    })
    .catch((err) => {
      console.log(err);
    })

    
  }

  getIndex(adjusted_data, factor){
    // Return an array of indexes to indicate which indexes to sample from

    // return [1, 10, 15, index, 30, 50]

    let slopes = {}
    let limit = Math.pow(Mean(adjusted_data),stdDev(adjusted_data))*factor// 0.1;
    let newPoints = [];
    let toRemove = [];
    let updated_vals = [];
    for(let i=1; i<adjusted_data.length; i++){
      if(adjusted_data[i-1] - adjusted_data[i] === 0)slopes[i] = Number.MAX_VALUE;
      else {
        slopes[i] = adjusted_data[i-1] - adjusted_data[i]
      }

    }
    newPoints.push(0);    

    for(let i=Object.keys(slopes).length-2; i> 0; i--){
      // console.log(Math.abs(slopes[i] - slopes[i+1]))
      if(Math.abs(slopes[i] - slopes[i+1]) < limit){ 
        toRemove.push(i);
      }

    }

    console.log(Object.keys(slopes).length);

    for(let i=0; i<toRemove.length; i++){
      delete slopes[toRemove[i]]
    }
    
    for(const [key, value] of Object.entries(slopes)){
      newPoints.push(Number(key));
    }

    newPoints.map((d) => {
      return updated_vals.push(adjusted_data[d])
    })

 

    console.log(newPoints);
    updated_vals = [...new Set(updated_vals)]
    console.log(updated_vals);

    let min;
    let max;
    // let minI;
    // let maxI;

    // for(let i=0; i<updated_vals.length; i++){
    //   if(updated_vals[i] == min)minI = updated_vals[i];
    //   if(updated_vals[i] == max)maxI = updated_vals[i];
    // }

    // Case 1:
    if(updated_vals.length === PLAYLIST_LENGTH)return updated_vals;
    else if(updated_vals.length < PLAYLIST_LENGTH){
      let missing = PLAYLIST_LENGTH - updated_vals.length;
      console.log("MISSING "+missing);

      for(let i=0; i<missing; i++){
        console.log("UPdated vals length is " + updated_vals.length)
        let randIndex = getRandInt(1, updated_vals.length);
        
        if(updated_vals[randIndex] > updated_vals[randIndex-1]){
          max = updated_vals[randIndex];
          min = updated_vals[randIndex-1];
        }else if(updated_vals[randIndex] < updated_vals[randIndex-1]){
          max = updated_vals[randIndex-1];
          min = updated_vals[randIndex];
        }
        else if(updated_vals[randIndex] === updated_vals[randIndex-1]){
          max = updated_vals[randIndex];
          min = updated_vals[randIndex-1]-0.005;
        }

        let firstArr = updated_vals.slice(0, randIndex)
        let lastArr = updated_vals.slice(randIndex, updated_vals.length);
        let randNum = getRandArbitrary(min, max);

        firstArr.push(randNum);
        firstArr.push(...lastArr);
        updated_vals = firstArr;     

      }

    }else if(updated_vals.length > PLAYLIST_LENGTH){
      let tocut = updated_vals.length - PLAYLIST_LENGTH;

      let mod = 0;
      if(tocut % 2 !== 0)mod=1; 
      
      let firstArr = updated_vals.slice(tocut/2+mod, updated_vals.length/2);
      let lastArr = updated_vals.slice(updated_vals.length/2, (updated_vals.length)-(tocut/2));
      firstArr.push(...lastArr);
      updated_vals = firstArr;
    }

    return updated_vals;

  }

  addToChain(chain, i, start, end, k){
    return chain.then(() => {
      return this.getRecommendations(i, start, end, k);
    })
  }

  render() { 

    return (
    <div>
    <p className="heading-text" style={{marginTop: "40px"}}>Generate New Playlist for <span className="orange">Dancebility <i className="las la-chevron-circle-down"></i></span></p>


      <div id="metrics-area">
        
        <div id="no-of-songs-block" className="metric-blocks" style={{"backgroundColor": "ffffff10"}}>

          <div>
            <div className="numbered-disc orange-bg float-to-left">1</div><p className="title-text float-to-left">Number of songs</p>
          </div>

          <p style={{marginTop: "100px"}} className="input-headers align-text-center"><i className="las la-exchange-alt"></i> Slide to change</p>
          <Scroller/>


          <p className="reduntant-text grey1 stick-to-bottom" style={{margin: "40px"}}>Enter the number of songs you would like to have in your playlist. Minimum of 6, maximum of 25.</p>

        </div>
        <Reference handler={this.handleChange}/>

        <LineGraph data={this.state.data}/>



    </div>
      <div style={{"marginTop": "20px"}} className="float-to-right">
        {this.state.selected ? 
            <button className="button-fill orange-bg" onClick={this.generate}>Generate playlist <img src="assets/icons/right-circle-white.svg" className="button-icons-on-right"/></button>
            :
            null
        }
      </div>
    </div>
  );
}}

// export default PlaylistBuilder;
export default PlaylistBuilderC;