import data from "./custom-playlist-data.js";

const customPlaylistData = customdata => {

createCustomPlaylist(customdata, "custom-playlist-block");

}

data.forEach(customdata => customPlaylistData(customdata));


function createCustomPlaylist(customdata, sectionId) {

const customPlaylistBlock = document.getElementById(sectionId);

const customPlaylistMainTable = document.createElement("table");
customPlaylistMainTable.setAttribute("id", "custom-playlist-mainTable")

const customPlaylistMainTr = document.createElement("tr");

const customPlaylistMainTd = document.createElement("td");

const customPlaylistInnerTable = document.createElement("table");
customPlaylistInnerTable.setAttribute("class", "custom-playlist-innerTable");

const customPlaylistInnerTr1 = document.createElement("tr");

const customPlaylistInnerTd1 = document.createElement("td");
customPlaylistInnerTd1.setAttribute("class", "custom-playlist-innerTd1");
customPlaylistInnerTd1.setAttribute("rowspan", "2");

const customPlaylistThumbnail = document.createElement("img");
customPlaylistThumbnail.setAttribute("class", "custom-playlist-thumbnail");
customPlaylistThumbnail.setAttribute("src", "" + customdata.thumbnail + "");

const customPlaylistInnerTd2 = document.createElement("td");
customPlaylistInnerTd2.setAttribute("class", "title-text custom-playlist-innerTd2");
customPlaylistInnerTd2.innerHTML = "" + customdata.songName + " <span class='small-text'> - " + customdata.time + "</span>";

const customPlaylistInnerTd3 = document.createElement("td");
customPlaylistInnerTd3.setAttribute("class", "custom-playlist-innerTd3 float-to-right");
customPlaylistInnerTd3.innerHTML = "<span class='text-button float-to-left grey2'><i class='las la-minus-circle'></i>REMOVE</span> | <span class='text-button float-to-right orange'><i class='las la-play'></i>PLAY</span>";

const customPlaylistInnerTr2 = document.createElement("tr");

const customPlaylistInnerTd4 = document.createElement("td");
customPlaylistInnerTd4.setAttribute("class", "sub-text custom-playlist-innerTd4");
customPlaylistInnerTd4.innerHTML = "" + customdata.artistName + "";

const customPlaylistInnerTd5 = document.createElement("td");
customPlaylistInnerTd5.setAttribute("class", "light-text float-to-right");
customPlaylistInnerTd5.innerHTML = "" + customdata.metric + ": " + customdata.metricPercent + "%";


customPlaylistBlock.append(customPlaylistMainTable);
customPlaylistMainTable.append(customPlaylistMainTr);
customPlaylistMainTr.append(customPlaylistMainTd);
customPlaylistMainTd.append(customPlaylistInnerTable);
customPlaylistInnerTable.append(customPlaylistInnerTr1);
customPlaylistInnerTr1.append(customPlaylistInnerTd1);
customPlaylistInnerTd1.append(customPlaylistThumbnail);
customPlaylistInnerTr1.append(customPlaylistInnerTd2);
customPlaylistInnerTr1.append(customPlaylistInnerTd3);
customPlaylistInnerTable.append(customPlaylistInnerTr2);
customPlaylistInnerTr2.append(customPlaylistInnerTd4);
customPlaylistInnerTr2.append(customPlaylistInnerTd5);


}

