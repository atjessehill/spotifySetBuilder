import React from 'react';
import {login} from '../services/SpotifyCalls'
import Cookies from 'universal-cookie';
import {useHistory} from 'react-router-dom';
import GenerateButton from './GenerateButton';

class Header extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            // refresh: props.refresh,
            access: props.access,
            userID: props.userID
        }
        console.log(this.state);
        this.handleGenerateClick = this.handleGenerateClick.bind(this);

    }

    handleGenerateClick(){

        // props.push({
        //     pathname: '/generate',
        //   })
  
    }



    render(){
        let spotifyText = "Connect to Spotify";

        if(this.state.access && this.state.userID)spotifyText="Logged in as "+this.state.userID;

        return (
            <div id="top-bar">
            <img src="../assets/icons/logo.svg" alt="logo alt"/> 
    
    
            <div className="float-to-right">
                <div className="float-to-right">
                    <button className="spotify button-line" onClick={this.props.handler}> 
                        <img src="../assets/icons/spotify.png" className="button-icons"/>
                        {spotifyText}
                        <div className="button-bg spotify-bg"> </div>
                    </button>
                </div>

                <GenerateButton/>

            </div>
            </div>

        )


    }
}

export default Header;