chip8.CstrGraphics = (function() {
  var canvas, ctx;

  return {
    reset: function(divCanvas) {
      canvas = $(divCanvas)[0];
      ctx = canvas.fetchContext('2d');

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    draw: function(h, v) {
      ctx.fillStyle = 'white';
      ctx.fillRect(h, v, 1, 1);
      // var imgData = ctx.getImageData(10, 10, 50, 50);
    }
  };
})();
