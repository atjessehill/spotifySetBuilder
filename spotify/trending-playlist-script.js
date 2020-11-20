
// Generate the playlist.

import data from "./playlist-data.js";

const playlistData = alldata => {

createPlaylist(alldata, "playlist-scroll-box-id");

}

data.forEach(alldata => playlistData(alldata));

function createPlaylist(alldata, sectionId) {


const playlistScrollSection = document.getElementById(sectionId);

const playlistBox = document.createElement("div");
playlistBox.setAttribute("class", "playlist-box");

const thumbnail = document.createElement("img");
thumbnail.setAttribute("class", "circular-thumbnail-large");
thumbnail.src = alldata.thumbnail;

const playlistName = document.createElement("p");
playlistName.setAttribute("class", "title-text align-text-center");
playlistName.innerHTML = alldata.name;

const playlistCreator = document.createElement("p");
playlistCreator.setAttribute("class", "sub-text align-text-center");
playlistCreator.innerHTML = "by " +  alldata.creator + "";

const noOfTracks = document.createElement("p");
noOfTracks.setAttribute("class", "small-text align-text-center");
noOfTracks.innerHTML = "" + alldata.noOfSongs + " songs for " + alldata.metric + "";

playlistScrollSection.append(playlistBox);
playlistBox.append(thumbnail);
playlistBox.append(playlistName);
playlistBox.append(playlistCreator);
playlistBox.append(noOfTracks);

}


// Scrolling the playlist automatically

var container = document.getElementById('playlist-scroll-box-id');
window.setTimeout(automaticScrollRight, 5000);
window.setTimeout(automaticScrollLeft, 10000);

function automaticScrollRight() {
	var element = container;
	var direction = "right";
	var speed = 10;
	var distance = 1500;
	var step = 40;
	sideScroll(element,direction,speed,distance,step);
    rightBullet2.className = "bullets orange-bg";
    rightBullet1.className = "bullets grey-bg-2";
}

function automaticScrollLeft() {
	var element = container;
	var direction = "left";
	var speed = 10;
	var distance = 1500;
	var step = 40;
	sideScroll(element,direction,speed,distance,step);
    rightBullet1.className = "bullets orange-bg";
    rightBullet2.className = "bullets grey-bg-2";
}

// Scrolling the playlist using the bullets

var rightBullet1 = document.getElementById('right-bullet-1');
rightBullet1.onclick = function () {
	rightBullet1.className = "bullets orange-bg";
	rightBullet2.className = "bullets grey-bg-2";
    sideScroll(container,'left',10,1500,40);
};

var rightBullet2 = document.getElementById('right-bullet-2');
rightBullet2.onclick = function () {
	rightBullet2.className = "bullets orange-bg";
	rightBullet1.className = "bullets grey-bg-2";
    sideScroll(container,'right',10,1500,40);
};


function sideScroll(element,direction,speed,distance,step){
    var scrollAmount = 0;
    var slideTimer = setInterval(function(){
        if(direction == 'left'){
            element.scrollLeft -= step;
        } else {
            element.scrollLeft += step;
        }
        scrollAmount += step;
        if(scrollAmount >= distance){
            window.clearInterval(slideTimer);
        }
    }, speed);
}