import React, {Component} from 'react';
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

                <Route path="" render={(props) => (<PlaylistBuilder {...props} testData={testData}/>)} exact/>

                </Switch>
            </div>
            </BrowserRouter>

        )
    }
}

export default App;