import data from "./dropdown-list-data.js";

const songListData = songdata => {

	const mainTable = document.getElementById("dropdown-table");

	const maintr = document.createElement("tr");
	maintr.setAttribute("id", "" + songdata.id + "");
	maintr.setAttribute("onclick", "selectThisSong(this.id)");
	maintr.setAttribute("class", "maintr");
	maintr.setAttribute("genre", songdata.genre);

	const maintd = document.createElement("td");
	maintd.setAttribute("class", "maintd");

	const innerTable = document.createElement("table");
	innerTable.setAttribute("class", "innerTable");

	const tr1 = document.createElement("tr");
	tr1.setAttribute("class", "innerTr1");

	const td1 = document.createElement("td");
	td1.setAttribute("rowspan", "2");

	const thumbnailImg = document.createElement("img");
	thumbnailImg.setAttribute("class", "list-thumbnail");
	thumbnailImg.setAttribute("src", songdata.thumbnail);

	const td2 = document.createElement("td");
	td2.innerHTML = songdata.songName;
	td2.setAttribute("class", "songs-in-dropdown-list");

	const tr2 = document.createElement("tr");

	const td3 = document.createElement("td");
	td3.innerHTML = songdata.artistName;
	td3.setAttribute("class", "artists-in-dropdown-list")



	mainTable.append(maintr);
	maintr.append(maintd);
	maintd.append(innerTable);
	innerTable.append(tr1);
	tr1.append(td1);
	td1.append(thumbnailImg)
	tr1.append(td2);
	innerTable.append(tr2);
	tr2.append(td3);

}

data.forEach(songdata => songListData(songdata));