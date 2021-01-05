import React from 'react';
import {login} from '../services/SpotifyCalls'
import Cookies from 'universal-cookie';
import {withRouter} from 'react-router-dom';
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
        console.log(props)
        this.goHome = this.goHome.bind(this);
        this.gotoLogin = this.gotoLogin.bind(this);
    }

    goHome(){
        this.props.history.push({
            pathname: "/",
        });

    }

    gotoLogin(){
        this.props.handler(false);
    }



    render(){
        let spotifyText = "Connect to Spotify";

        if(this.state.access && this.state.userID)spotifyText=this.state.userID;

        return (
            <div id="top-bar">
            <img onClick={this.goHome} src="../assets/icons/logo.svg" alt="logo alt" className="logo"/> 
    
    
            <div className="float-to-right">
                <div className="float-to-right">
                    <button className="spotify button-line" onClick={this.gotoLogin}> 
                        <img src="../assets/icons/spotify.png" className="button-icons"/>
                        {spotifyText}
                        <div className="button-bg spotify-bg"> </div>
                    </button>
                </div>

                <GenerateButton popuphandler={this.props.popuphandler}/>

            </div>
            </div>

        )


    }
}

export default withRouter(Header);