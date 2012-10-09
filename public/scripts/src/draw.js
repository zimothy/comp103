var canvas;

canvas = $("#game")[0].getContext('2d');

function drawHexagon(tile, sideLength, edgeWidth) {
  canvas.save();

  canvas.strokeStyle = tile.selected ? "red" : "#000000";
  canvas.lineWidth = edgeWidth;
  canvas.fillStyle = tile.passable ? (tile.castle ? "gray" : "#00FF00") : "#00AAFF";
  canvas.lineJoin = "round";

  canvas.rotate(Math.PI / 6);

  canvas.beginPath();
  canvas.moveTo(sideLength, 0);

  _.times(5, function() {
    canvas.rotate(Math.PI / 3);
    canvas.lineTo(sideLength, 0);
  });
  
  canvas.closePath();
  canvas.stroke();
  canvas.fill();

  canvas.restore();

  if (tile.units > 0) {
    canvas.save();
    canvas.lineWidth = 1;
    canvas.fillStyle = "#000000";
    canvas.font = (sideLength / 2) + "pt Helvetica";
    var text = tile.units.toString();
    canvas.fillText(text, -canvas.measureText(text).width / 2, 5);
    canvas.restore();
  }
}

// Draws a full grid of tiles.
//
// Because a tile links to every other one in the grid, the starting tile is all
// that is needed to navigate the full tileset.
//
// Each tile will be drawn with its full width as the given argument. The tile
// itself is a regular hexagon.
function drawTileGrid(startingTile, tileWidth, edgeWidth) {
  var columnTile, rowTile, toEast, tileHeight, mod, dx, dy;

  canvas.save();
  tileHeight = tileWidth / Math.sin(Math.PI / 3);

  toEast = true;
  columnTile = startingTile;

  canvas.save();

  while (typeof columnTile !== "undefined") {
    rowTile = columnTile;

    canvas.save();

    do {
      drawHexagon(rowTile, tileHeight / 2, edgeWidth);

      canvas.translate(tileWidth + edgeWidth / 2, 0);
      rowTile = rowTile.east;
    } while (rowTile !== columnTile);

    canvas.restore();

    mod = toEast ? 1 : -1;
    dx = mod * tileWidth / 2 + mod * edgeWidth / 4;
    dy = tileHeight * 0.75 + edgeWidth / 2;
    canvas.translate(dx, dy);

    columnTile = columnTile['south' + (toEast ? 'East' : 'West')];
    toEast = !toEast;
  }

  canvas.restore();
  canvas.restore();
}

exports.drawTileGrid = drawTileGrid;
