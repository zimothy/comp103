var directions, tiles, doc, game, canvas;

doc = $(document);
game = $("#game")[0];
canvas = game.getContext('2d');

directions = [
  'east',
  'southEast',
  'southWest',
  'west',
  'northWest',
  'northEast'
];

tiles = JSON.parse($("#map").text());

_.each(tiles, function(tile) {
  _.each(directions, function(direction) {
    tile[direction] = tiles[tile[direction]];
  });
});

exports.main = function() {
  var drawTileGrid, tileWidth, tileHeight, edgeWidth, edgeLength, offsetY,
      columnCount, columnTile, gridWidth, gridHeight, mouseDown, x, y, tx, ty;

  drawTileGrid = modules.draw.drawTileGrid;

  function setTileWidth(to) {
    tileWidth = to;
    tileHeight = tileWidth / Math.sin(Math.PI / 3);
    edgeWidth = tileWidth / 10;
    edgeLength = tileHeight / 2;

    offsetY = edgeLength + edgeWidth / 2;

    canvas.restore();
    canvas.save();

    canvas.translate(0, offsetY);

    gridWidth = (function() {
      var rowCount, rowTile;

      rowCount = 0;
      rowTile = tiles[0];

      do {
        rowCount++;
        rowTile = rowTile.east;
      } while (rowTile !== tiles[0]);

      return rowCount * (tileWidth + edgeWidth / 2);
    })();

    gridHeight = (function() {
      var columnCount, columnTile, toEast;

      columnCount = 0;
      columnTile = tiles[0];
      toEast = true;

      while (columnTile) {
        columnCount++;

        columnTile = columnTile['south' + (toEast ? 'East' : 'West')];
        toEast = !toEast;
      }

      return columnCount * (tileHeight * 0.75 + edgeWidth / 2) + edgeLength / 2;
    })() + edgeWidth / 2;
  }

  mouseDown = false;

  x = 0;
  y = 0;
  tx = 0;
  ty = 0;

  function drawGrid() {
    var dx;

    canvas.clearRect(0, -offsetY, game.width, game.height);

    canvas.save();

    canvas.translate(tx, ty);

    drawTileGrid(tiles[0], tileWidth, edgeWidth);

    if (tx > 0) {
      canvas.save();
      canvas.translate(-gridWidth, 0);
      drawTileGrid(tiles[0], tileWidth, edgeWidth);
      canvas.restore();
    }

    dx = gridWidth;

    while (tx + dx - tileWidth < game.width) {
      canvas.save();
      canvas.translate(dx, 0);
      drawTileGrid(tiles[0], tileWidth, edgeWidth);
      canvas.restore();

      dx += gridWidth;
    }

    canvas.restore();
  }

  setTileWidth(75);
  drawGrid();

  $("#game").mousedown(function(evt) {
    mouseDown = true;
    x = evt.pageX;
    y = evt.pageY;
    return false;
  });

  function reposition(pageX, pageY) {
    var dx, dy;

    dx = pageX - x;
    dy = pageY - y;
    x = pageX;

    tx += dx;

    // Loop x-scrolling.
    if (tx > gridWidth) {
      tx -= gridWidth;
    }

    // Stop y-scrolling at edge of screen.
    if (gridHeight >= game.height) {
      if (ty + dy > 0) {
        ty = 0;
      } else if ((ty + dy) + gridHeight < game.height) {
        ty = game.height - gridHeight;
      } else {
        ty += dy;
      }

      y = pageY;
    } else {
      if (ty + dy < 0) {
        ty = 0;
      } else if (ty + dy > game.height - gridHeight) {
        ty = game.height - gridHeight;
      } else {
        ty += dy;
        y = pageY;
      }
    }
    
    drawGrid();
  }

  $(document).mouseup(function() {
    mouseDown = false;
  }).mousemove(function(evt) {
    if (mouseDown) {
      reposition(evt.pageX, evt.pageY);
      return false;
    }
  });

  if (game.onmousewheel) {
    game.onmousewheel = function(evt) {
      var newTileWidth;

      newTileWidth = tileWidth + evt.wheelDeltaY / 10;

      if (newTileWidth < 30) {
        newTileWidth = 30;
      } else if (newTileWidth > 100) {
        newTileWidth = 100;
      }

      setTileWidth(newTileWidth);
      reposition(x, y);
      drawGrid();
    };
  }
};
