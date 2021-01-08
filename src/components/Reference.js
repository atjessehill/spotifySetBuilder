import React from 'react';
import '../App.css';
import { search, artists } from '../services/SpotifyCalls';

class Reference extends React.Component {

    constructor(props){
        console.log(props)
        super(props);
        this.state = {
            songs: [],
            hasSelected: false,
            selectedSongName: "",
            selectedArtistName: ""
        }
        this.filterDropDown = this.filterDropDown.bind(this);
        this.selectThisSong = this.selectThisSong.bind(this);
    }



    componentDidMount(){
        document.getElementById('dropdown-block-id').style.display = "none";
    }

    selectThisSong(event){
    
        const [target, id, name, artist, artistID ]= event.target.id.split(':')
        let genre;
        artists(artistID)
        .then(res => {

            genre = res.genres[0]
            console.log(res.genres)
            this.props.handler({
                type: "URI", 
                value: 'spotify:track:'+id   
               });
    
            this.setState((state) => {
                return {
                    selectedSongName: name,
                    selectedArtistName: artist,
                    hasSelected: true
                }
    
                
            }, () => {
                document.getElementById("genre-text-id").innerHTML = genre;
    
                let fillSearchBox = document.getElementById("search-box-id");
                fillSearchBox.value = "" + this.state.selectedSongName + " - " + this.state.selectedArtistName + "";
                  
            })

        });




    }

    filterDropDown(event){

        if (event.target.id != 'search-box-id')return

        let filter = event.target.value;
        console.log(filter);
        if (filter === ""){
            console.log("here")
            this.setState({
                hasSelected: false
            })
            this.props.handler({
                type: "REMOVE", 
               });
            return
        }

        search(event.target.value)
            .then(res => {
                this.setState({
                    songs: res,
                    hasSelected: false
                })

            })

        let mainTable = document.getElementById('dropdown-table');

        if(filter.length == 0)document.getElementById('dropdown-block-id').style.display = "none";
        document.getElementById("dropdown-block-id").style.display = "block";

    }



    render(){

        let selectedValue  = "";
        if (this.state.hasSelected){
            selectedValue = this.state.selectedSongName + " - " + this.state.selectedArtistName;
        }

        let songs = this.state.songs;
        const songChoices = [];
        if (songs.length != 0){
            songs.map(s => {

                const innerTableID = `innerTable:${s.id}:${s.name}:${s.artists[0].name}:${s.artists[0].id}`;
                const maintdID = `maintd:${s.id}:${s.name}:${s.artists[0].name}:${s.artists[0].id}`;
                const innerTr1ID = `innerTr1:${s.id}:${s.name}:${s.artists[0].name}:${s.artists[0].id}`;
                const rowSpanID = `rowSpan:${s.id}:${s.name}:${s.artists[0].name}:${s.artists[0].id}`;
                const songID = `songsindrlist:${s.id}:${s.name}:${s.artists[0].name}:${s.artists[0].id}`;
                const artistdrlist = `artistindrlist:${s.id}:${s.name}:${s.artists[0].name}:${s.artists[0].id}`

                const maintr = <tr 
                    // key={s.id} 
                    id={s.id}
                    onClick={this.selectThisSong}
                    className = "maintr"
                    key={s.id}
                > 
                    <td id={maintdID} className = "maintd">
                        <table id={innerTableID} className = "innerTable">
                            <tbody>
                                <tr id={innerTr1ID} className="innerTr1">
                                    <td id={rowSpanID} rowSpan="2"></td>
                                {/* <img src={s.album.images[2]} className = "list-thumbnail"/> */}

                                    <td id={songID} className = "songs-in-dropdown-list">{s.name}</td>

                                </tr>
                                <tr> 
                                    <td id={artistdrlist} className = "artists-in-dropdown-list"> {s.artists[0].name}</td>
                                </tr>

                            </tbody>



                        </table>

                    </td>
                
                </tr>

                songChoices.push(maintr);

            })
            
        }

        return (
            <div id="reference-song-block" className="metric-blocks">
				
            <div>
                <div className="numbered-disc orange-bg float-to-left">2</div><p className="title-text float-to-left">Select reference song</p>
            </div>

            <p className="input-headers" style={{"marginTop": "130px"}}>
                <i className="las la-search"></i> Search for a song</p>
            {/* value={this.state.hasSelected ? selectedValue: ""} */}
            <div id="dropdown-group">
                <input type="search" placeholder="Search for a song..." id="search-box-id" onChange={this.filterDropDown} className="reference-input-text"/> 
                {/* onkeyup="filterDropDown()" */}
                <p className="reduntant-text grey1" style={{"marginTop": "-4px"}}>Type at least 3 letters...</p>

                <p className="sub-text" style={{"marginTop": "20px"}}>Genre: <span id="genre-text-id" className="spotify"></span></p>

                {/* <script type="text/javascript" src="filter-reference-dropdown-list.js"></script> */}

                {this.state.hasSelected 
                
                }
                <div id="dropdown-block-id" style={{display: this.state.hasSelected ? 'none': 'block'}}className="dropdown-block">
                    <table id="dropdown-table" className="dropdown-table">
                        <tbody>
                        {songChoices}

                        </tbody>
                        {/* <script type="module" src="reference-song-list.js"></script> */}
                    </table>
                </div>
            </div>



            <p className="reduntant-text grey1 stick-to-bottom" style={{"margin": "30px"}}>We will use the reference song to find songs that match your taste.</p>
            
        </div>

        )


    }
}

export default Reference;