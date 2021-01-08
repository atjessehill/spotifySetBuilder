import React, {useEffect, useRef, useState} from "react";
import lottie from 'lottie-web';
import '../App.css';

const Popup = (props) =>   {

    const container = useRef(null);
    const [isVisible, setVisible] = useState(false);

    console.log(props);
    if(props.isIndex){
        console.log(props.isIndex)
    }

    useEffect(() => {

        let testvar;

        if(props.isBuildingPlaylist){
            console.log("here")
            testvar = require('../BuildingPlaylist.json')

        }
        else if(props.isIndex){
            testvar = require('../SpotifyRounded.json');

        }
        else if(props.isPlaylist){
            testvar = require('../SavePlaylist.json');
        }

        // let test = '../assets/SpotifyRounded.js'
        
        lottie.loadAnimation({
            container: container.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: testvar
        })
    }, [])
    
    function spotifyConnect() { 
        props.login(true)
    }
    
    return(
        <div>


            {props.isIndex ?     
                <div className="pop-up-div" id="connect-to-spotify-popup-id" style={{display: "block"}}>
                    <div className="pop-up">

                    <p className="title-text align-text-center">Connect your Spotify</p>

                    <div className="lottie-spotify-success" ref={container}> </div>

                    <p className="sub-text align-text-center" style={{marginTop: "20px"}}>Quicky add custom playlists to your Spotify by logging in with your Spotify account</p>

                    <div className="text-button spotify align-text-center" style={{marginTop: "40px"}} onClick={spotifyConnect}><i class="lab la-spotify"></i> CONNECT TO SPOTIFY <i class="las la-external-link-alt"></i></div>

                    <div onClick={props.togglePopup} className="text-button grey1 align-text-center" style={{marginTop: "30px"}}><i class="las la-times-circle"></i> CLOSE</div>
            
                    </div>
                    </div>      
                    : null 
            }

            {props.isPlaylist ? 
            
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
        
            : null}

            {props.isBuildingPlaylist ? 
            
                <div className="pop-up-div" id="sent-to-spotify-success-id" style={{display: "block"}}>
                    <div className="pop-up">
        
            
                    <div className="lottie-spotify-success" ref={container}>
        
                    </div>
                    <p className="title-text align-text-center">Just a minute while we build you a playlist!</p>

                    {/* <div onClick={props.togglePopup} className="text-button align-text-center grey1" style={{marginTop: "20px"}} ><i className="las la-times-circle"></i> CLOSE</div> */}
        
                    </div>
                </div>     
        
            : null}  



        </div>



  
    )}

export default Popup;