import React, {Component} from 'react';
import PlaylistBuilder from './components/PlaylistBuilder';
import Login from './components/Login';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

class App extends Component{
    render(){
        return (
            <BrowserRouter>
            <div>
            <Switch>
                <Route path="/login" component={Login}/>

                <Route path="" component={PlaylistBuilder} exact/>

                </Switch>
            </div>
            </BrowserRouter>

        )
    }
}

export default App;