import React from 'react';

class Playlist extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            playlist_name: 'noshuffle playlist'
        }

        this.savePlaylist = this.savePlaylist.bind(this);
        
    }

    savePlaylist(){

        // if (!generated)return
        console.log(this.state);

    //   createPlaylist(this.state.playlist_name)
    //     .then((response) => {
    //       const playlistId = response.data.id
    //       const uris = thisplaylist.join(',')
    //       addSongstoPlaylist(playlistId, uris)
    //       // .then((res) => {
    //         // TODO show confirmation that a user is done
    //       // })
    
    //     });
    
    
      }

    componentDidMount(){
        console.log(this.props.history.location.state.playlist)
        // for each item in this list, get the song descriptors
    }

    handleChange(event) {
        const eventId = event.target.id
        // if (eventId === 'name-input')PLAYLIST_NAME_MAIN = event.target.value;    
    }

    render(){
        return (
        <div>
            <h1>Playlist Page</h1>
            <input type="text" id="name-input" placeholder="my special playlist" onChange={this.handleChange}></input>
            <button onClick={this.savePlaylist}> Save Playlist </button>

        </div>
        );
    }
}

export default Playlist;