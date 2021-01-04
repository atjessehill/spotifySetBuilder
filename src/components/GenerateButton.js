import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {isSignedIn} from '../services/SpotifyCalls';

const GenerateButton = (props) => {
    // const [fillValue, setSeconds] = useState(0);
    let history = useHistory();

    function handleClick(){

        // If all cookies are present history.push(/generate)
        // else show popup
        if(isSignedIn()){
            history.push("/generate");
        }
        else{
            console.log("here")
            props.popuphandler(true)
        }

    }

    return (
        <div className="float-to-right">
        <button className="button-line orange" onClick={handleClick}> 
            <img className="button-icons" src="../assets/icons/plus-circle-orange.svg" />
             <span className="desktopOnly" style={{float: "right"}}>Generate new playlist</span>
            <div className="button-bg orange-bg"></div>
        </button>
    </div>
    )
}

export default GenerateButton;