import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {isSignedIn} from '../services/SpotifyCalls';

const CycleLarge = (props) => {
    let history = useHistory();
    let [featureIndex, setFeature] = useState(0)
    const features = ["Danceability", "Energy"]

    useEffect(() => {
        console.log(featureIndex);
    }, []);



    const cycleFeature = () => {
        // console.log("Cycling");
        let toUpdate = 0;
        if(featureIndex == features.length-1)toUpdate = 0;
        else{
            toUpdate = featureIndex+1
            // setFeature(featureIndex+1,() => props.updateFeature(features[featureIndex]));
        }
        console.log(toUpdate, features[toUpdate]);
        props.updateFeatureType(features[toUpdate]);
        setFeature((featureIndex) => toUpdate);

    }



    return (

        <p className="heading-text" style={{marginTop: "40px"}} onClick={cycleFeature}>Generate New Playlist for <span className="orange">{features[featureIndex]} <i class="las la-sort"></i></span></p>

        )
}

export default CycleLarge;