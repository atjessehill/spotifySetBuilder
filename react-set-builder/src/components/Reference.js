import React from 'react';
import '../App.css';
import { search } from '../services/SpotifyCalls';

class Reference extends React.Component {

    constructor(props){
        console.log(props)
        super(props);
        this.state = {
            songs: []
        }
        this.filterDropDown = this.filterDropDown.bind(this);
        // this.selectThisSong = this.selectThisSong.bind(this);
    }



    componentDidMount(){
    
    }

    selectThisSong(event){
        // const id;
        // const name
        // const artist;
        
        const [target, id, name, artist ]= event.target.id.split(':')
        
        console.log(id);
        console.log(name);
        console.log(artist);

    }

    filterDropDown(event){

        if (event.target.id != 'search-box-id')return

        let filter = event.target.value;

        search(event.target.value)
            .then(res => {
                console.log(res)
                this.setState({
                    songs: res
                })

            })

        let mainTable = document.getElementById('dropdown-table');

        if(filter.length == 0)document.getElementById('dropdown-block-id').style.display = "none";
        document.getElementById("dropdown-block-id").style.display = "block";

    }



    render(){

        let songs = this.state.songs;
        const songChoices = [];
        console.log(songs.length);
        if (songs.length != 0){
            console.log("redoing this");
            songs.map(s => {

                const maintdID = `maintd:${s.id}:${s.name}:${s.artists[0].name}`;
                const innerTr1ID = `innerTr1:${s.id}:${s.name}:${s.artists[0].name}`;
                const rowSpanID = `rowSpan:${s.id}:${s.name}:${s.artists[0].name}`;
                const songID = `songsindrlist:${s.id}:${s.name}:${s.artists[0].name}`;
                const artistdrlist = `artistindrlist:${s.id}:${s.name}:${s.artists[0].name}`

                const maintr = <tr 
                    // key={s.id} 
                    id={s.id}
                    onClick={this.selectThisSong}
                    className = "maintr"
                    key={s.id}
                > 
                    <td id={maintdID} className = "maintd">
                        <table className = "innerTable">
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
                // maintr.append(maintd); //
                // maintd.append(innerTable); 
                // innerTable.append(tr1);
                // tr1.append(td1);
                // td1.append(thumbnailImg)
                // tr1.append(td2);
                // innerTable.append(tr2);
                // tr2.append(td3);

                // songChoices.push(maintr)

            })
            
            console.log(songChoices);
        }

        return (
            <div id="reference-song-block" className="metric-blocks">
				
            <div>
                <div className="numbered-disc orange-bg float-to-left">2</div><p className="title-text float-to-left">Select reference song</p>
            </div>

            <p className="input-headers" style={{"marginTop": "130px"}}><i className="las la-search"></i> Search for a song</p>

            <div id="dropdown-group">
                <input type="search" placeholder="Search for a song..." id="search-box-id" onChange={this.filterDropDown} className="reference-input-text"/> 
                {/* onkeyup="filterDropDown()" */}
                <p className="reduntant-text grey1" style={{"marginTop": "-4px"}}>Type at least 3 letters...</p>

                <p className="sub-text" style={{"marginTop": "20px"}}>Genre: <span id="genre-text-id" className="spotify"></span></p>

                <script type="text/javascript" src="filter-reference-dropdown-list.js"></script>

                <div id="dropdown-block-id" className="dropdown-block">
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