import React from 'react';
import BannerText from './BannerText';

class Home extends React.Component {

    constructor(props){
        super(props);
        // this.props.current.changeBackground();
        // console.log(props.handler.changeBackground);
    }

    componentDidMount(){
        this.props.handler.current.changeBackground("Home")
    }

    render(){
        const url = '../../assets/bg-imgs/groove.jpg';

        return (
        <div>

            <div id="banner-area">

            <BannerText popuphandler={this.props.popuphandler} updateFeature={this.props.updateFeature}/>

            <div>
                {/* Explainer video comes here. */}
            </div>

            </div>

            {/* <div id="trending-playlist">

            <p class="heading-text">Trending Playlists by Users</p>

            <div class="sub-section-bar">
                <p class="sub-text" style={{paddingTop: "20px", width: "500px", float: "left"}}>Show playlists for <span class="orange">Dancibility <i class="las la-chevron-circle-down"></i></span></p>

                <div class="right-side-bullets float-to-right">
                    <div class="bullets grey-bg-2" id="right-bullet-2"></div><div class="bullets orange-bg" id="right-bullet-1"></div>
                </div>
            </div>

            <div id="playlist-scroll-box-id" class="scroll-box">

                <script type="module" src="trending-playlist-script.js"></script>
                
            </div>

            </div> */}

        </div>
        )
    }
}

export default Home;