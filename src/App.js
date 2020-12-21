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

class App extends Component{

    constructor(props){
        super(props);

        const cookies = new Cookies();

        this.state = {
            userID: cookies.get('SPOT_DISPLAY_ID'),
            access: cookies.get('SPOT_USER_accessToken'),
            refresh: cookies.get('SPOT_USER_refreshToken')
        }

        this.refreshBackground = React.createRef();

        this.triggerLogin = this.triggerLogin.bind(this);
        this.getbackgroundRef = this.getbackgroundRef.bind(this);
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
    }

    getbackgroundRef(){
        return this.refreshBackground;
    }

    render(){
        return (
            <div>
                <Background ref={this.refreshBackground}/> 
                <div id="content-area">
                    {/* <Header/> */}

                    <BrowserRouter>
                    <Header access={this.state.access} userID={this.state.userID} handler={this.triggerLogin}/>

                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/generate" render={(props) => (<PlaylistBuilder
                            {...props} 
                            handler={this.refreshBackground} 
                            refreshHandler={this.getbackgroundRef}
                            />)}/>
                        <Route path="/playlist" render={(props) => (<Playlist {...props} handler={this.refreshBackground}/>)}/>
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