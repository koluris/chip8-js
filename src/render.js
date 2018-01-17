chip8.CstrGraphics = (function() {
  var canvas, ctx;

  return {
    reset: function(divCanvas) {
      canvas = $(divCanvas)[0];
      ctx = canvas.fetchContext('2d');

      // ctx.fillStyle = 'black';
      // ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ctx.beginPath();
      // ctx.moveTo(0, 0);
      // ctx.lineTo(300, 150);
      // ctx.strokeStyle = '#fff';
      // ctx.stroke();
    },

    update: function() {
      // for (var v=0; v<32; v++) {
      //   for (var h=0; h<64; h++) {
      //     area
      //   }
      // }
    },

    madeCollision: function() {
      // var imgData = ctx.getImageData(10, 10, 50, 50);
    }
  };
})();
