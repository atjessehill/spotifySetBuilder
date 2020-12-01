import React from 'react';

class Home extends React.Component {

    render(){


        return (
        <div>

            <div id="banner-area">

            <div id="banner-text-area">
            {/* <script type="module" src="banner-slideshow.js"></script> */}
            <p id="banner-text">Create the <span id='text-to-fill'>perfect Spotify</span> Playlist</p>
            <div class="slideshow-bullets">
                <div class="bullets grey-bg-2" id="bullet-1"></div><div class="bullets grey-bg-2" id="bullet-2"></div><div class="bullets orange-bg" id="bullet-3"></div>
            </div>
            <p class="sub-text" style={{paddingTop: "50px"}}>Curate playlists with changing <span class="orange">Dancebility <i class="las la-chevron-circle-down"></i></span> with time</p>
            <div style={{marginTop: "20px"}}>
                    <button class="button-fill orange-bg" onclick="window.open('generate.html', '_self')">Get started <img src="assets/icons/right-circle-white.svg" class="button-icons-on-right"/></button>
            </div>
            </div>

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