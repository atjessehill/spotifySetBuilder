import React, {Component} from 'react';
import Home from './components/Home'
import Playlist from './components/Playlist';
import PlaylistBuilder from './components/PlaylistBuilder';
import Login from './components/Login';
import Header from './components/Header';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

class App extends Component{

    // componentDidMount(){
    //     const script = document.createElement("script");
    //     script.src = "../spotify/header-footer.js";
    //     // script.async = true;
    //     document.body.appendChild(script);
    // }

    render(){
        return (          
           <div id="content-area">
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

           </div>


        )
    }
}

export default App;