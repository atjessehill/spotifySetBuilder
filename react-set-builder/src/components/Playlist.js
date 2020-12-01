import React from 'react';
import {tracks, addSongstoPlaylist, createPlaylist} from '../services/SpotifyCalls';

class Playlist extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            playlist_name: 'noshuffle playlist',
            tracklist: [],
            genre: ""
        }

        this.savePlaylist = this.savePlaylist.bind(this);
        
    }

    savePlaylist(){

        // if (!generated)return
        console.log(this.state);
        const ids = this.state.tracklist.map((d) => {
            return d.id;
        })

        
      createPlaylist(this.state.playlist_name)
        
      .then((response) => {
          const playlistId = response.data.id
          const uris = ids.join(',')
          addSongstoPlaylist(playlistId, uris)
          .then((res) => {
            // TODO show confirmation that a user is done
          })
    
        });
    
    
      }

    componentDidMount(){
        console.log(this.props.history.location.state.playlist)

        tracks(this.props.history.location.state.playlist)
        .then((res) => {
            this.setState({
                tracklist: res, 
                genre: this.props.history.location.state.genre,
                uri: this.props.history.location.state.uri
            });

        })


        // for each item in this list, get the song descriptors
    }

    handleChange(event) {
        const eventId = event.target.id
        if (eventId === 'name-input')return;    
    }

    parseArtist(data){
        let artistStr = "";
        data.map((d) => {
            return artistStr = artistStr+d.name+' '
        })
        return artistStr
        
    }


    render(){
        const songs = this.state.tracklist;
        const songChoices = [];
        let uriImg = "";
        if(songs.length != 0){
            songs.map( s => {

                console.log(s.uri + " "+this.state.uri);
                if (s.uri == this.state.uri)
                {
                    console.log("found match")
                    uriImg = s.album.images[0].url;

                }
                
                const maintr = <tr key={s.id}>
                    <td>
                        <table className="custom-playlist-innerTable">
                            <tbody>
                            <tr >
                                <td className="custom-playlist-innerTd1" rowSpan="2">
                                    <img className="custom-playlist-thumbnail" src={s.album.images[2].url}/>
                                </td>
                                <td className="title-text custom-playlist-innerTd2">{s.name}</td>
                                <td className="custom-playlist-innerTd3 float-to-right">
                                    <span className="text-button float-to-left grey2">
                                        <i className="las la-minus-circle">
                                            {/* ::before */}

                                        </i>
                                        REMOVE
                                    </span>
                                    <span className="text-button float-to-right orange">
                                        <i className="las la-play">
                                        </i>
                                        PLAY
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="sub-text custom-playlist-innerTd4">{this.parseArtist(s.artists)}</td>
                                {/* <td className="light-text float-to-right custom-playlist-innerTd5"> Danceability </td> */}
                            </tr>
                            </tbody>
                        </table>

                    </td>

                </tr>
            songChoices.push(maintr);
            })
        }

        return (
            <div id="playlist-area">

			<div id="playlist-left">
				<img src={uriImg} className="album-art playlist-album-art-tile"/>

				<p className="input-headers" style={{marginTop: "30px"}}>Playlist name:</p>

				<input type="paragraph" name="playlistName" placeholder="Enter playlist name..." id="playlist-name-id" className="set-playlist-name"/>

				<p className="sub-text" style={{marginTop: "0px"}}>Genre: <span id="genre-text-id" className="spotify">{this.state.genre}</span></p>

				<p className="light-text" style={{marginTop: "0px"}}>By <span id="artist-name-id">Ronak Laungani</span></p>

				<div style={{marginTop: "20px"}}>
					<button className="button-fill orange-bg" >Add playlist to Spotify <img src="../assets/icons/right-circle-white.svg" className="button-icons-on-right"/></button>
				</div>

				<div>
                    <button className="button-line orange"><img src="../assets/icons/plus-circle-orange.svg" className="button-icons"/> 
                        Share
                        <div className="button-bg orange-bg">
                        </div>
                    </button>
                </div>

			</div>

			<div id="playlist-right">

				<div>
					<div className="input-headers float-to-left" style={{marginTop: "0px"}}><span id="playlist-no-of-tracks">{songChoices.length}</span> songs for <span id="playlist-metric">Dancibility</span></div>
					<div className="text-button float-to-right orange"><i className="las la-play"></i> PLAY ALL</div>
				</div>

				<div className="custom-playlist-scroll-box">

				<div id="custom-playlist-block">
                    <table id="custom-playlist-mainTable">
                    <tbody>
                    {songChoices}

                    </tbody>
                    </table>					
				</div>
				</div>
			</div>
			
		</div>

        );
    }
}

export default Playlist;