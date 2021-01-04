import React, {useEffect, useRef} from "react";
import lottie from 'lottie-web';
import '../App.css';

const Popup = (props) =>   {

    const container = useRef(null);

    useEffect(() => {
        lottie.loadAnimation({
            container: container.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: require('../SpotifyRounded.json'),
        })
    }, []) 

        return(
            <div className="pop-up-div" id="connect-to-spotify-popup-id" style={{display: "block"}}>
            <div className="pop-up">
    
            <p className="title-text align-text-center">Connect your Spotify</p>
    
            <div className="lottie-spotify-success" ref={container}>

            </div>
    
            <p className="sub-text align-text-center" style={{marginTop: "20px"}}>Quicky add custom playlists to your Spotify by logging in with your Spotify account</p>
    
            <div className="text-button spotify align-text-center" style={{marginTop: "40px"}} onclick="window.open('generate.html', '_self')"><i class="lab la-spotify"></i> CONNECT TO SPOTIFY <i class="las la-external-link-alt"></i></div>
    
            <div className="text-button grey1 align-text-center" style={{marginTop: "30px"}} onclick="closePopUp()"><i class="las la-times-circle"></i> CLOSE</div>
            
            </div>
        </div>        
    )}

export default Popup;