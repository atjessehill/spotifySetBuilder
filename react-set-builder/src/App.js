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

class App extends Component{

    constructor(props){
        super(props);

        const cookies = new Cookies();

        this.state = {
            userID: cookies.get('SPOT_USER_ID'),
            access: cookies.get('SPOT_USER_accessToken'),
            refresh: cookies.get('SPOT_USER_refreshToken')
        }
        this.triggerLogin = this.triggerLogin.bind(this);
        console.log(this.state);
    }

    // componentDidMount(){
    //     const script = document.createElement("script");
    //     script.src = "../spotify/header-footer.js";
    //     // script.async = true;
    //     document.body.appendChild(script);
    // }

    triggerLogin(){
        login()
        console.log("here");
    }

    render(){
        return (
            <div>
            <div id="background-setup">
            <div id="background-tint-2"> </div>
            </div>

                <div id="content-area">
                    <Header access={this.state.access} userID={this.state.userID} handler={this.triggerLogin}/>
                    {/* <Header/> */}

                    <BrowserRouter>

                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/home" component={Home}/>
                        <Route path="/playlist" component={Playlist}/>
                        <Route path="" component={PlaylistBuilder} exact/>

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