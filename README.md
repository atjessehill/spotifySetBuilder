# spotifySetBuilder // noshuffle.herokuapp.com

### Hello Visitors 

This is an application built to create more meaningful plalylists and prototype DJ sets. This is built by [Ronak Laungani](http://ronaklaungani.com) and I, using React and the Spotify API. It is a work in progress with v1 expected in early December 2020. The current live version can be found [here](https://noshuffle.herokuapp.com), but this may not reflect the latest dev version.

Users can create a new playlist by (1) specifying the number of songs (2) setting a reference song which acts as a seed (3) drawing how the energy levels of 'danceability' changes over time. This is possible thanks to the [audio features](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-features/) available through the spotify API.

### Progress Updates

- [x] API interactions
- [x] Design -- finalized design can be found [here] (http://ronaklaungani.com/spotify/index.html)
- [x] Conduct initial usability tests using vanilla JS design (no api interaction)
- [ ] Finish migrating design from vanilla JS to react (in progress)
- [ ] Improve graph interactivity
- [ ] Improve removal of interpolated points 
- [ ] Final usability tests


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

