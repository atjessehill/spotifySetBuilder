import React from 'react';
import {tracks, addSongstoPlaylist, createPlaylist, getPlayer, addToPlay} from '../services/SpotifyCalls';

class Playlist extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            playlist_name: 'noshuffle playlist',
            tracklist: [],
            genre: "",
            device_id: "none",
            device_loaded: false,
            FEATURE_TYPE: this.props.history.location.state.feature.split('_')[1]
        }
        console.log(this.state);


        this.savePlaylist = this.savePlaylist.bind(this);
        this.playerCheckInterval = null;
        this.createEventHandlers = this.createEventHandlers.bind(this);
        this.playSong = this.playSong.bind(this);
        this.playAll = this.playAll.bind(this);
    }

    checkForPlayer(){
        console.log("Checking");
        if(window.Spotify !== null){
            clearInterval(this.playerCheckInterval);
            this.player = getPlayer();
            this.createEventHandlers();
        }

    }

    createEventHandlers(){
        console.log(this.player);

        this.player.addListener('initialization_error', e => console.log(e));
        this.player.addListener('authentication_error', e=> {
            console.error(e);
        });
        this.player.addListener('account_error', e => { console.error(e); });
        this.player.addListener('playback_error', e => { console.error(e); });
           
        // Ready
        this.player.addListener('ready', data => {

            this.state.device_id = data.device_id;
            this.setState({device_loaded: true})

        });
        this.player.connect();
      
    }

    playSong(e){
        const uid = e.target.id.split(':')[1];
        addToPlay(this.state.device_id, ["spotify:track:"+uid])
        this.player.resume().then(() => {
            // console.log("Resumed");
        })
    }

    playAll(){
        const URIs = []
        this.state.tracklist.map(s => {
            URIs.push(s.uri);
        })
        addToPlay(this.state.device_id, URIs);
        this.player.resume().then(() => {
            // console.log("Resumed");
        })
        
    }

    savePlaylist(){
        this.props.popuphandler(false, false, true);

        // if (!generated)return
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
        tracks(this.props.history.location.state.playlist)
        .then((res) => {
            this.setState({
                tracklist: res, 
                genre: this.props.history.location.state.genre,
                uri: this.props.history.location.state.uri
            });

        })
        .then(() => {
            this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
        })


        // for each item in this list, get the song descriptors
    }

    updateValue(playlist_name) {
        this.setState({playlist_name});
    }

    parseArtist(data){
        let artistStr = "";
        data.map((d) => {
            return artistStr = artistStr+d.name+' '
        })
        return artistStr
    }


    render(){
        const colorPlay = this.state.device_loaded ? "text-button float-to-right orange":"text-button float-to-right grey1"
        const songs = this.state.tracklist;
        const songChoices = [];
        let uriImg = "";
        if(songs.length != 0){
            songs.map( s => {

                if (s.uri == this.state.uri)
                {
                    uriImg = s.album.images[0].url;
                    this.props.handler.current.changeBackground("Playlist", uriImg)


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
                                        {/* <i className="las la-minus-circle">

                                        </i>
                                        REMOVE */}
                                    </span>
                                    {/* <span className={colorPlay} id={"parent:"+s.id} onClick={this.playSong}>
                                        <i className="las la-pause" id={"child:"+s.id}  >
                                        </i>
                                    </span> */}
                                    <span className={colorPlay} id={"parent:"+s.id} onClick={this.playSong}>
                                        <i className="las la-play" id={"child:"+s.id}  >
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
            <div>
            {/* <div id="playlist-background-setup" className="album-art" style={{backgroundImage: `url(${uriImg})`}}>
            <div id="background-tint-3"> </div>
            </div> */}


            <div id="playlist-area">

			<div id="playlist-left">

            <div id="playlist-left-division">

				<img src={uriImg} className="album-art playlist-album-art-tile"/>

                <div id="playlist-left-division-right">

				<p className="input-headers" style={{marginTop: "10px"}}>Playlist name:</p>

				<input type="paragraph" onChange={(input) => this.updateValue(input.target.value)} name="playlistName" placeholder="Enter playlist name..." id="playlist-name-id" className="set-playlist-name"/>

				{/* <p className="sub-text" style={{marginTop: "0px"}}>Genre: <span id="genre-text-id" className="spotify">{this.state.genre}</span></p> */}

				{/* <p className="light-text" style={{marginTop: "0px"}}>By <span id="artist-name-id">Ronak Laungani</span></p> */}
            
                </div>

            </div>

            <p className="sub-text" style={{marginTop: "0px"}}>Genre: <span id="genre-text-id" className="spotify">{this.state.genre}</span></p>

				<div style={{marginTop: "20px"}}>
					<button onClick={this.savePlaylist} className="button-fill orange-bg add-to-spotify-bttn" >Add playlist to Spotify <img src="../assets/icons/right-circle-white.svg" className="button-icons-on-right"/></button>
				</div>

				<div>
                    <button className="button-line orange share-bttn"><img src="../assets/icons/share.svg" className="button-icons"/> 
                        Share
                        <div className="button-bg orange-bg">
                        </div>
                    </button>
                </div>

			</div>

			<div id="playlist-right">

				<div>
					<div className="input-headers float-to-left" style={{marginTop: "0px"}}><span id="playlist-no-of-tracks">{songChoices.length}</span> songs based on <span id="playlist-metric">{this.state.FEATURE_TYPE}</span></div>
					<div className={colorPlay} onClick={this.playAll}><i className="las la-play"></i> PLAY ALL</div>
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

                <div style={{marginTop: "60px"}} className="mobileOnly">
					<button onClick={this.savePlaylist} className="button-fill orange-bg add-to-spotify-bttn" >Add playlist to Spotify <img src="../assets/icons/right-circle-white.svg" className="button-icons-on-right"/></button>
				</div>

				<div className="mobileOnly">
                    <button className="button-line orange share-bttn"><img src="../assets/icons/share.svg" className="button-icons"/> 
                        Share
                        <div className="button-bg orange-bg">
                        </div>
                    </button>
                </div>

        </div>
        );
    }
}

export default Playlist;