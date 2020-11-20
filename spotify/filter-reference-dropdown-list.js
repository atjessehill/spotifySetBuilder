// Filtering the dropdown based on input

function filterDropDown() {

  var input, filter, mainTable, trs, innerTable, listedSong, tds, innerTr, i, txtValue;
    input = document.getElementById("search-box-id");
    filter = input.value.toUpperCase();

    mainTable = document.getElementById("dropdown-table");
    trs = mainTable.getElementsByTagName("tr");

    console.log(trs);


    if (filter.length == 0) {
    document.getElementById("dropdown-block-id").style.display = "none";
  }
  else { 
    document.getElementById("dropdown-block-id").style.display = "block";
  }

  for (i = 0; i < trs.length; i+=3) {

    tds = trs[i].getElementsByClassName("songs-in-dropdown-list")[0];

    console.log(trs[i].id);
    console.log(tds);

    if (tds) {
      txtValue = tds.textContent || tds.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        trs[i].style.display = "";
      } else {
        trs[i].style.display = "none";
      }
    }
  }
}


// Fetching the clicked song and displaying it in the search bar.


function selectThisSong(fetchedId) {

    var selectedTr = document.getElementById(fetchedId);
    var selectedSongName = selectedTr.getElementsByClassName("songs-in-dropdown-list")[0].innerHTML;
    var selectedArtistName = selectedTr.getElementsByClassName("artists-in-dropdown-list")[0].innerHTML;
    const selectedGenre = selectedTr.getAttribute("genre");
    console.log(selectedGenre);
    console.log(selectedSongName, selectedArtistName);
     var fillSearchBox = document.getElementById("search-box-id");
     fillSearchBox.value = "" + selectedSongName + " - " + selectedArtistName + "";

     document.getElementById("genre-text-id").innerHTML = "" + selectedGenre + "";

     document.getElementById("dropdown-block-id").style.display = "none";

}



