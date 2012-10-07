var canvas;

canvas = $('#game')[0].getContext('2d');

function drawHexagon(size, colour) {
  canvas.save();

  canvas.strokeStyle = "#000000";
  canvas.fillStyle = colour;
  canvas.lineJoin = "round";

  canvas.rotate(Math.PI / 6);

  canvas.beginPath();
  canvas.moveTo(size, 0);

  _.times(6, function() {
    canvas.rotate(Math.PI / 3);
    canvas.lineTo(size, 0);
  });
  
  canvas.closePath();
  canvas.stroke();
  canvas.fill();

  canvas.restore();
}

function drawGrid(width, height, size) {
  var dist, shift;

  dist = size * 2 * Math.sin(Math.PI / 3);
  forward = true;

  canvas.save();

  _.times(height + 2, function(i) {

    canvas.save();

    _.times(width + 2, function(j) {
      var colour;

      if (i == 0 || i == height + 1 || j == 0 || j == width + 1) {
        colour = "#000000";
      } else {
        colour = "#00FF00";
      }

      drawHexagon(size, colour);
      canvas.translate(dist, 0);
    });

    canvas.restore();

    canvas.translate(dist / 2 * (forward ? 1 : -1), size * 1.5);
    forward = !forward;
  });

  canvas.restore();
}

canvas.translate(-35, 0);
drawGrid(9, 7, 48);
