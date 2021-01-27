# NoShuffle.club // https://noshuffle.club

### Hello Visitors 

NoShuffle is an web app which allows for the creation of more meaningful playlists and the prototyping of DJ sets. The central feature of NoShuffle is an interactive graph that lets the user draw how the energy or danceability of a playlist changes over time. This is built by [Ronak Laungani](http://ronaklaungani.com) and I, using React and the Spotify API. 

V1 of the site is now live. Future development will be done throughout the semester when I have a break from class :)

Core functionality:

Users can create a new playlist by (1) specifying the number of songs (2) setting a reference song which acts as a seed (3) drawing how the energy levels of 'danceability' changes over time. This is possible thanks to the [audio features](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/) available through the spotify API.

### Progress Updates

- [x] API interactions
- [x] Design -- finalized design can be found [here] (http://ronaklaungani.com/spotify/index.html)
- [x] Conduct initial usability tests using vanilla JS design (no api interaction)
- [x] Finish migrating design from vanilla JS to react (in progress)
- [x] Improve graph interactivity
- [x] Improve removal of interpolated points 
- [x] Final usability tests

### Development goals

- bug fixes (feel free to create an issue)
- "Remix Mode"



Useful links

TODO:

** Simplify points
https://stackoverflow.com/questions/33207230/remove-interpolated-points-from-graph-data-using-c-sharp
https://en.m.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm (epsilon could be std+mean)
https://www.intmath.com/plane-analytic-geometry/perpendicular-distance-point-line.php


Create line/wave graph
https://programmer.help/blogs/using-d3js-region-generator-to-realize-simple-wave-graph.html

Graphs:
https://github.com/muratkemaldar/using-react-hooks-with-d3/blob/08-breaking-bad/src/GaugeChart.js

https://dev.to/taowen/make-react-svg-component-draggable-2kc

https://observablehq.com/@d3/sticky-force-layout?collection=@d3/d3-drag

