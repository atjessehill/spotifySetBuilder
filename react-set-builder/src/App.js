import React, {Component} from 'react';
import Home from './components/Home'
import Playlist from './components/Playlist';
import PlaylistBuilder from './components/PlaylistBuilder';
import Login from './components/Login';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

let testData = [1, 2, 3, 4];

class App extends Component{
    render(){
        return (
            <BrowserRouter>
            <div>
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/home" component={Home}/>
                <Route path="/playlist" component={Playlist}/>
                <Route path="" render={(props) => (<PlaylistBuilder {...props} testData={testData}/>)} exact/>

                </Switch>
            </div>
            </BrowserRouter>

        )
    }
}

export default App;