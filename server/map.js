var _, directions;

_ = require('underscore');

directions = [
  'east',
  'southEast',
  'southWest',
  'west',
  'northWest',
  'northEast'
];

function makeMap(rows, cols) {
  var above, isAboveWest, id, map;

  isAboveWest = false;
  id = 0;

  map = [];

  function assignAbove(tile) {
    var aboveWest, aboveEast;

    if (above) {
      aboveWest = isAboveWest ? above : above.west;
      aboveEast = isAboveWest ? above.east : above;

      tile.northWest = aboveWest;
      tile.northEast = aboveEast;

      aboveWest.southEast = tile;
      aboveEast.southWest = tile;
    }
  }

  _.times(cols, function() {
    var start, before, next, aboveWest, aboveEast;

    // Start of the row.
    start = new Tile(id++);
    map.push(start);
    next = start;
    before = start;

    assignAbove(start);

    if (above) {
      above = above.east;
    }

    _.times(rows - 1, function() {
      var aboveWest, aboveEast;

      // Make the next tile (to the east of the previous one).
      next = new Tile(id++);
      map.push(next);

      before.east = next;
      next.west = before;

      assignAbove(next);

      before = next;

      if (above) {
        above = above.east;
      }
    });

    next.east = start;
    start.west = next;

    above = start;
    isAboveWest = !isAboveWest;
  });

  return map;
}


function Tile(id) {
  this.id = id;
  this.color = Math.random() > 0.1 ? "#00FF00" : "#0000FF";
}

Tile.prototype = {

  toJSON: function() {
    var json;

    json = {
      id: this.id,
      color: this.color
    };

    _.each(directions, function(direction) {
      if (this[direction]) {
        json[direction] = this[direction].id;
      }
    }, this);

    return json;
  }

};

exports.makeMap = makeMap;
exports.directions = directions;
