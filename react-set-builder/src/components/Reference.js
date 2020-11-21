import React from 'react';
import '../App.css';

class Reference extends React.Component {

    constructor(props){
        console.log(props)
        super(props);
        this.state = {

        }

    }



    componentDidMount(){
    
    }


    render(){


        return (
            <div id="reference-song-block" className="metric-blocks">
				
            <div>
                <div className="numbered-disc orange-bg float-to-left">2</div><p className="title-text float-to-left">Select reference song</p>
            </div>

            <p className="input-headers" style={{"marginTop": "130px"}}><i className="las la-search"></i> Search for a song</p>

            <div id="dropdown-group">
                <input type="search" placeholder="Search for a song..." id="search-box-id" onkeyup="filterDropDown()" class="reference-input-text"/>
                <p className="reduntant-text grey1" style={{"marginTop": "-4px"}}>Type at least 3 letters...</p>

                <p className="sub-text" style={{"marginTop": "20px"}}>Genre: <span id="genre-text-id" className="spotify"></span></p>

                <script type="text/javascript" src="filter-reference-dropdown-list.js"></script>

                <div id="dropdown-block-id" className="dropdown-block">
                    <table id="dropdown-table" className="dropdown-table">
                        <script type="module" src="reference-song-list.js"></script>
                    </table>
                </div>
            </div>



            <p className="reduntant-text grey1 stick-to-bottom" style={{"margin": "30px"}}>We will use the reference song to find songs that match your taste.</p>
            
        </div>

        )


    }
}

export default Reference;