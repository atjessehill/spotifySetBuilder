// Slideshow - filling the text

var textToFill = document.getElementById("text-to-fill");

var fillValue = 0;

var test = setInterval(fillFunction, 1);


    function fillFunction(){
 		if (fillValue <= 1000) {
        // console.log(fillValue);
        // textToFill.style.opacity = "" + fillValue + "%";
        textToFill.style.backgroundImage = "linear-gradient(90deg, #FF4732 " + fillValue/10 + "%, #ffffff " + fillValue/10 + "%, #ffffff 0%)";
        fillValue += 1;
        // console.log(fillValue);
        
    }
    else { window.clearInterval(test)
            changeText();
            };
    }



function changeText() {

    var bannerText = document.getElementById("banner-text");

    var bannerTextText = bannerText.innerText;

    var bannerTextHTML = bannerText.innerHTML;

    console.log(bannerTextText);
    console.log(bannerTextHTML);

    if (bannerTextText == "Create the <span id='text-to-fill'>perfect Spotify</span> Playlist") {
        bannerTextText = "Set <span id='text-to-fill'>different music metrics</span> across playlist timeline";
    }

}

