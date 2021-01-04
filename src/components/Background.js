import React from 'react';

class Background extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            from: null,
            img: null
        }
        this.changeBackground = this.changeBackground.bind(this);

    }

    changeBackground(from, img){
        console.log(from)
        this.setState({from: from, img: img})
    }

    render(){

        let background =                 <div id="background-setup" className="album-art">
        <div id="background-tint"> </div>
        </div>

        if(this.state.from != null){
            if (this.state.from == "Playlist"){
                background = <div id="playlist-background-setup" className="album-art" style={{backgroundImage: `url(${this.state.img})`}}>
                <div id="background-tint-3"> </div>
                </div>
            }

            if (this.state.from == "Home"){
                background = <div id="background-setup" className="album-art" style={{backgroundImage: `url(../assets/bg-imgs/groove.jpg)`}}>
                <div id="background-tint"> </div>
                </div>            
            }
            if (this.state.from == "Generate"){
                background = <div id="background-setup">
                <div id="background-tint-2"> </div>
                </div>            
            }


        }



        return (
            <div>
            {background}

            </div>

        )
    }
}

export default Background;