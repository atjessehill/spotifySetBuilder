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
import PopupB from './components/PopupB';

class App extends Component{

    constructor(props){
        super(props);

        const cookies = new Cookies();

        this.state = {
            userID: cookies.get('SPOT_DISPLAY_ID'),
            access: cookies.get('SPOT_USER_accessToken'),
            refresh: cookies.get('SPOT_USER_refreshToken'),
            popup: false,
            popupIndex: null
        }

        this.refreshBackground = React.createRef();
        this.switchPopup = React.createRef();
        this.triggerLogin = this.triggerLogin.bind(this);
        this.getbackgroundRef = this.getbackgroundRef.bind(this);
        this.showPopup = this.showPopup.bind(this);
    }

    triggerLogin(){
        login()
    }

    showPopup(isIndex){
        console.log(isIndex)
        console.log(this.state)
        this.setState({popup: !this.state.popup})
        this.setState({popupIndex: isIndex})
    }

    getbackgroundRef(){
        return this.refreshBackground;
    }

    render(){
        console.log(this.state)

        let popup;
        if (this.state.popup && this.state.popupIndex){
            console.log("case 1")
            popup = <Popup togglePopup={this.showPopup} login={this.triggerLogin}/>

        }
        else if (this.state.popup && !this.state.popupIndex){
            console.log("case 2")
            popup = <PopupB togglePopup={this.showPopup} login={this.triggerLogin}/>
        }
        // else {
        //     popup = null
        // }
        console.log(popup);

        return (
            <div>

                {/* {this.state.popup ? <Popup togglePopup={this.showPopup} login={this.triggerLogin} isIndex={this.state.popupIndex}/> : null} */}
                {popup}
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
                            />)}/>
                        <Route path="/playlist" render={(props) => (<Playlist {...props} handler={this.refreshBackground} popuphandler={this.showPopup}/>)}/>
                        <Route path="" render={(props) => (<Home {...props} handler={this.refreshBackground}/>)} exact/>

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