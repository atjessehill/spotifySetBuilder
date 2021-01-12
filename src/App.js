import React, {Component} from 'react';
import Home from './components/Home'
import Playlist from './components/Playlist';
import PlaylistBuilder from './components/PlaylistBuilder';
import Login from './components/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import {login } from './services/SpotifyCalls';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Cookies from 'universal-cookie';
import Background from './components/Background';
import Popup from './components/Popup';

class App extends Component{

    constructor(props){
        super(props);

        const cookies = new Cookies();

        this.state = {
            userID: cookies.get('SPOT_DISPLAY_ID'),
            access: cookies.get('SPOT_USER_accessToken'),
            refresh: cookies.get('SPOT_USER_refreshToken'),
            popup: false,
            isIndex: null,
            featureType: "target_danceability"
        }
        this.refreshBackground = React.createRef();
        this.switchPopup = React.createRef();
        this.triggerLogin = this.triggerLogin.bind(this);
        this.getbackgroundRef = this.getbackgroundRef.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.updateFeature = this.updateFeature.bind(this);
    }

    triggerLogin(toGenerate){
        login(toGenerate)
    }

    showPopup(isIndex, isBuildingPlaylist, isPlaylist){
        this.setState({popup: !this.state.popup})
        this.setState({isIndex: isIndex, isBuildingPlaylist: isBuildingPlaylist, isPlaylist: isPlaylist})
    }

    getbackgroundRef(){
        return this.refreshBackground;
    }

    updateFeature(type){
        // console.log(type);
        this.state.featureType = type;
    }

    render(){

        return (
            <div>

                {this.state.popup ? <Popup togglePopup={this.showPopup} login={this.triggerLogin} 
                    isIndex={this.state.isIndex} 
                    isBuildingPlaylist={this.state.isBuildingPlaylist}
                    isPlaylist={this.state.isPlaylist}
                        
                    /> : null}
                <Background ref={this.refreshBackground}/> 
                <div id="content-area">
                    {/* <Header/> */}

                    <BrowserRouter>
                    <Header access={this.state.access} userID={this.state.userID} handler={this.triggerLogin} popuphandler={this.showPopup}/>

                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/generate" render={(props) => (<PlaylistBuilder
                            {...props} 
                            handler={this.refreshBackground} 
                            refreshHandler={this.getbackgroundRef}
                            popuphandler={this.showPopup}
                            featureType={this.state.featureType}
                            />)}/>
                        <Route path="/playlist" render={(props) => (<Playlist {...props} handler={this.refreshBackground} popuphandler={this.showPopup}/>)}/>
                        <Route path="" render={(props) => (<Home 
                            {...props} 
                            handler={this.refreshBackground} 
                            popuphandler={this.showPopup}
                            updateFeature={this.updateFeature}
                            />)} exact/>

                        </Switch>
                    </BrowserRouter>
                    <div id="footer"></div>
                    <Footer/>
                </div>
           </div>


        )
    }
}

export default App;