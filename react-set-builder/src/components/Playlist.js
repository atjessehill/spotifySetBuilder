import React from 'react';

class Playlist extends React.Component {

    constructor(props){
        super(props);

    }

    componentDidMount(){
        console.log(this.props.history.location.state.playlist)
        // for each item in this list, get the song descriptors
    }

    render(){
        return <h1> Playlist Page</h1>
    }
}

export default Playlist;