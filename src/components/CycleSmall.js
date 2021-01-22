import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {isSignedIn} from '../services/SpotifyCalls';

const CycleSmall = (props) => {
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
        props.updateFeature(features[toUpdate]);
        setFeature((featureIndex) => toUpdate);

    }



    return (

            <p class="sub-text" style={{paddingTop: "10px", cursor: "pointer"}} onClick={cycleFeature}>Curate playlists with changing <span class="orange"> {features[featureIndex]} <i class="las la-sort"></i></span> with time
            </p>
//featureIndex => setFeature(featureIndex == features.length-1 ? 0: featureIndex+1)
    )
}

export default CycleSmall;