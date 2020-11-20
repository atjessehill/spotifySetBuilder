

// Header code

const topBar = document.getElementById("top-bar");

const siteLogo = document.createElement("img");
siteLogo.src = "assets/icons/logo.svg";
siteLogo.className = "logo";
siteLogo.setAttribute("onclick", "window.open('index.html', '_self')");

const rightSide =  document.createElement("div");
rightSide.className = "float-to-right";

const buttonDiv1 = document.createElement("div");
buttonDiv1.className = "float-to-right";

const button1 = document.createElement("button");
button1.className = "spotify button-line";
const spotifyIcon = document.createElement("img");
spotifyIcon.src = "assets/icons/spotify.png"
spotifyIcon.className = "button-icons";
const spotifyText = " Connect to Spotify";
const spotifyBg = document.createElement("div");
spotifyBg.className = "button-bg spotify-bg";

const buttonDiv2 = document.createElement("div");
buttonDiv2.className = "float-to-right";

const button2 = document.createElement("button");
button2.className = "button-line orange";
button2.setAttribute("onclick", "window.open('generate.html', '_self')")
const generateIcon = document.createElement("img");
generateIcon.src = "assets/icons/plus-circle-orange.svg"
generateIcon.className = "button-icons";
const generateText = " Generate new playlist";
const generateBg = document.createElement("div");
generateBg.className = "button-bg orange-bg";

topBar.append(siteLogo);
topBar.append(rightSide);
rightSide.append(buttonDiv1);
buttonDiv1.append(button1);
button1.append(spotifyIcon);
button1.append(spotifyText);
button1.append(spotifyBg);
rightSide.append(buttonDiv2);
buttonDiv2.append(button2);
button2.append(generateIcon);
button2.append(generateText);
button2.append(generateBg);


// Footer Code

const footer = document.getElementById("footer");

const leftText = document.createElement("p");
leftText.className = "sub-text";
leftText.innerHTML = 'Made with <i class="las la-heart"></i> by <a href="" class="text-links grey1">Jesse Hill</a> & <a href="" class="text-links grey1">Ronak Laungani</a>'

const rightImage = document.createElement("img");
rightImage.src = "assets/icons/jesse-ronak.svg";
rightImage.className = "footer-img";

footer.append(leftText);
footer.append(rightImage);





