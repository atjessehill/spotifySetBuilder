import React, {useEffect, useRef, useState} from "react";
import lottie from 'lottie-web';
import '../App.css';

const PopupB = (props) =>   {

    const container = useRef(null);
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        lottie.loadAnimation({
            container: container.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../SavePlaylist.json')
        })
    }, [])
    
    function spotifyConnect() { 
        console.log("Connect to Spotify")
    }
    
    return(
        // style={{display: isVisible ? "block": "none"}}
        <div className="pop-up-div" id="sent-to-spotify-success-id" style={{display: "block"}}>
		<div className="pop-up">

		<p className="title-text align-text-center">Look at you going!</p>
    
            <div className="lottie-spotify-success" ref={container}>

            </div>
    
            <p className="small-text align-text-center">Your playlist has been added to your Spotify account.</p>

            <p className="sub-text align-text-center">Head over to your Spotify account to enjoy your custom playlist.</p>

            <div onClick={props.togglePopup} className="text-button align-text-center grey1" style={{marginTop: "20px"}} ><i className="las la-times-circle"></i> CLOSE</div>

            </div>
        </div>     
    )}

export default PopupB;