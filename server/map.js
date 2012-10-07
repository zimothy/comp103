function makeMap(rows, cols) {
  var above, aboveWest;

  aboveWest = false;

  _.times(cols, function() {
    var start, before;

    // Start of the row.
    start = new Tile();
    before = start;

    _.times(rows - 1, function() {
      var next, aboveAcross;

      // Make the next tile (to the east of the previous one).
      next = new Tile();

      before.east = new Tile();
      next.west = before;

      if (above) {
        above['south' + (aboveWest ? 'East' : 'West')]  = next;
        next['north' + (aboveWest ? 'West' : 'East')] = above;

        aboveAcross = aboveWest ? above.east : above.west;

        if (aboveAcross) {
          aboveAcross['south' + (aboveWest ? 'West' : 'East')] = next;
          next['north' + *(aboveWest ? 'East' : 'West')] = aboveAcross;
        }
      }

      before = next;
    });

    above = start;
    aboveWest = !aboveWest;
  });

  return null;
}


function Tile() {

}



module.exports = {
  makeMap: makeMap;
};
