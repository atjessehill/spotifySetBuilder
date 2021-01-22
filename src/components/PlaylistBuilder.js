import React, { useState} from 'react';
import '../App.css';
import LineGraph from './LineGraph';
import Reference from './Reference';
import Scroller from './Scroller';
import {getFeatures, requestRecs, login, search } from '../services/SpotifyCalls';
import Datagen from '../services/Datagen';
import {Variance, Mean, stdDev, getRandInt, getRandArbitrary, SimplifyLine} from '../services/Helper';
import CycleLarge from './CycleLarge';

let FEATURE_TYPE = 'target_energy'
let PLAYLIST_LENGTH = 6;
let THIS_PLAYLIST;

class PlaylistBuilderC extends React.Component {

  constructor(props){
    super(props);
    console.log(this.props.featureType);
    const data = Datagen();

    this.state = {
      data: data,
      selected: false,
      FEATURE_TYPE: 'target_danceability'
    }
    this.handleChange = this.handleChange.bind(this);
    this.generate = this.generate.bind(this);
    this.addToChain = this.addToChain.bind(this);
    this.getRecommendations = this.getRecommendations.bind(this);
    this.updateFeatureType = this.updateFeatureType.bind(this);
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

    // this.props.popuphandler(false, true, false);

    const scroller = document.getElementById('scroller');

    PLAYLIST_LENGTH = (scroller.scrollLeft/50*1)+6

		this.setState({PLAYLIST_LENGTH: ((((scroller.scrollLeft)/50)*1)+6)})
        
    let sampledPoints = SimplifyLine(this.state.data, PLAYLIST_LENGTH)

    let seedIndex;

    let adjusted_data;
    this.setState({THIS_PLAYLIST: new Array(PLAYLIST_LENGTH).fill(0)})

    
    getFeatures(this.state.SEED_URI_MAIN.split(':')[2])
    .then((res) => {
      const songFeature = FEATURE_TYPE.split('_')[1]
      const features = res.data
      let closestVal = 100;

      /*
      Adjust the line to your reference song.
      */

      for(let i=0; i<sampledPoints.length; i++){

        let diff = Math.abs(sampledPoints[i]-features[songFeature]);
        
        if (diff < closestVal){
          closestVal = diff;
          seedIndex = i
        }
      }
      const offset = sampledPoints[seedIndex]-features[songFeature];

      adjusted_data = sampledPoints.map((d) => {
        return (offset >= 0) ? d+offset:d-offset
      })


      // Places the seed song in the final playlist
      const update = this.state.THIS_PLAYLIST;
      update[seedIndex] = this.state.SEED_URI_MAIN.split(':')[2];
      this.setState({THIS_PLAYLIST:update})
        

    })
    .then(() => {
      let promise = Promise.resolve()

      for(let i=seedIndex+1; i<sampledPoints.length; i++){
        const k = {}
        k[FEATURE_TYPE] = sampledPoints[i]
        const end = seedIndex + Math.min(i-seedIndex, 5);
        promise = this.addToChain(promise, i, seedIndex, end, k);

      }
      console.log(this.state.THIS_PLAYLIST);
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
        console.log(this.state.FEATURE_TYPE);
        this.props.history.push({
          pathname: '/playlist',
          state: {
            playlist: this.state.THIS_PLAYLIST,
            feature: this.state.FEATURE_TYPE,
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

  addToChain(chain, i, start, end, k){
    return chain.then(() => {
      return this.getRecommendations(i, start, end, k);
    })
  }

  updateFeatureType(feature){
    console.log("updating feature type to"+feature)

    if(feature==="Energy"){
      this.setState({FEATURE_TYPE: 'target_energy'})
      // this.state.FEATURE_TYPE='target_energy'
    }else if(feature==="Danceability"){
      this.setState({FEATURE_TYPE: 'target_danceability'})

      // this.state.FEATURE_TYPE='target_danceability'
    }

  }

  render() { 

    return (
    <div>
      <CycleLarge updateFeatureType={this.updateFeatureType}/>
      <div id="metrics-area">
        
        <div id="no-of-songs-block" className="metric-blocks" style={{"backgroundColor": "ffffff10"}}>

          <div>
            <div className="numbered-disc orange-bg float-to-left">1</div><p className="title-text float-to-left">Number of songs</p>
          </div>

          <p style={{marginTop: "130px"}} className="input-headers align-text-center"><i className="las la-exchange-alt"></i> Slide to change</p>
          <Scroller/>


          <p className="reduntant-text grey1 stick-to-bottom" style={{margin: "40px"}}>Enter the number of songs you would like to have in your playlist. Minimum of 6, maximum of 25.</p>

        </div>
        <Reference handler={this.handleChange}/>

        <LineGraph data={this.state.data} featureType={this.state.FEATURE_TYPE}/>



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