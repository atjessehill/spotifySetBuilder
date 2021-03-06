import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {isSignedIn} from '../services/SpotifyCalls';
import CycleSmall from './CycleSmall';

const BannerText = (props) => {
    const [fillValue, setSeconds] = useState(0);
    let history = useHistory();
    let [featureIndex, setFeature] = useState(0)
    const features = ["Danceability", "Energy"]

    useEffect(() => {
        const interval = setInterval(() => {
            const textToFill = document.getElementById("text-to-fill");
            if (fillValue <= 1000) {
                // console.log(fillValue);
                // textToFill.style.opacity = "" + fillValue + "%";
                // textToFill.style.backgroundImage = "linear-gradient(90deg, #FF4732 " + fillValue/10 + "%, #ffffff " + fillValue/10 + "%, #ffffff 0%)";
                setSeconds(fillValue => fillValue+1);
                // console.log(fillValue);
                
            }
            else { window.clearInterval(test)
                    // changeText();
            };
            
        


        }, 1);
        return () => clearInterval(interval);
    }, []);

    function goToGenerate() {

        // If all cookies are present history.push(/generate)
        // else show popup
        if(isSignedIn()){
            history.push("/generate");
        }
        else{
            console.log("here")
            props.popuphandler(true, false, false)
        }
    }


    return (
        <div id="banner-text-area">
            {/* <script type="module" src="banner-slideshow.js"></script> */}
            <p id="banner-text">Create the <span id='text-to-fill' style={{backgroundImage: "linear-gradient(90deg, #FF4732 " + fillValue/10 + "%, #ffffff " + fillValue/10 + "%, #ffffff 0%)"}}><br className="mobileOnly"/>perfect Spotify</span> Playlist</p>
            <div class="slideshow-bullets">
                <div class="bullets grey-bg-2" id="bullet-1"></div><div class="bullets grey-bg-2" id="bullet-2"></div><div class="bullets orange-bg" id="bullet-3"></div>
            </div>
            <CycleSmall updateFeature={props.updateFeature}></CycleSmall>
            <div style={{marginTop: "20px"}}>
                    <button class="button-fill orange-bg" onClick={goToGenerate}>Get started <img src="assets/icons/right-circle-white.svg" class="button-icons-on-right"/></button>
            </div>
            </div>
    )
}

export default BannerText;