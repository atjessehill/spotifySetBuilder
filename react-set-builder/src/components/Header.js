import React from 'react';
import {login} from '../services/SpotifyCalls'

class Header extends React.Component {

    render(){

        return (
            <div id="top-bar">
            <img src="../assets/icons/logo.svg" alt="logo alt"/> 
    
    
            <div className="float-to-right">
                <div className="float-to-right">
                    <button className="spotify button-line" onClick={login}> 
                        <img src="../assets/icons/spotify.png" className="button-icons"/>
                        Connect to Spotify
                        <div className="button-bg spotify-bg"> </div>
                    </button>
                </div>

                <div className="float-to-right">
                    <button className="button-line orange"> 
                        <img className="button-icons" src="../assets/icons/plus-circle-orange.svg" />
                         Generate new playlist
                        <div class="button-bg orange-bg"></div>
                    </button>
                </div>

            </div>
            </div>

        )


    }
}

export default Header;