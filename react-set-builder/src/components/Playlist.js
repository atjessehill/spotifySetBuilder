import React from 'react';
import {tracks} from '../services/SpotifyCalls';

class Playlist extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            playlist_name: 'noshuffle playlist',
            tracklist: []
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

        tracks(this.props.history.location.state.playlist)
        .then((res) => {
            this.setState({tracklist: res});
            console.log(this.state.tracklist);

        })


        // for each item in this list, get the song descriptors
    }

    handleChange(event) {
        const eventId = event.target.id
        // if (eventId === 'name-input')PLAYLIST_NAME_MAIN = event.target.value;    
    }

    parseArtist(data){
        let artistStr = "";
        data.map((d) => {
            artistStr = artistStr+d.name+' '
        })
        return artistStr
        
    }


    render(){
        const songs = this.state.tracklist;
        const images = this.state.tracklist.map((d) => {
            console.log(d.album.images[0]);
            return <img key={d} src={d.album.images[2].url} alt="image"/>
        })
        return (
        <div>
            <h1>Playlist Page</h1>
            <input type="text" id="name-input" placeholder="my special playlist" onChange={this.handleChange}></input>
            <button onClick={this.savePlaylist}> Save Playlist </button>
            <div class="song-list">

                {songs.map((d) => {
                    return (<div> 
                        {d.name} - {this.parseArtist(d.artists)}
                        
                        {/* {images} */}
                        <img src={d.album.images[2].url}/> 
                    </div>)
                })}
                {/* {this.state.tracklist} */}
            </div>
        </div>
        );
    }
}

export default Playlist;