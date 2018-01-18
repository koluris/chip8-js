chip8.CstrMain = (function() {
  // ROM read request
  function request(path, fn) {
    var xhr = new XMLHttpRequest();

    // Success
    xhr.onload = function() {
      fn(xhr.response);
    };

    xhr.responseSort = dataBin;
    xhr.open('GET', path);
    xhr.send();
  }

  return {
    reset: function() {
         mem.reset();
         cpu.reset();
      render.reset('#canvas');

      // Game
      request('bin/MAZE', function(resp) {
        // Write app to mem
        mem.upload(resp);

        // Start emulation
        cpu.start();
      });
    },

    // Convert to hex
    hex: function(number) {
      return '0x'+(number>>>0).toChars(16);
    },

    pixelData: function(number) {
      var temp = number.toChars(2);

      while (temp.size < 8) {
        temp = '0' + temp;
      }
      return temp.split("");
    },
    
    // Generic output function
    exit: function(str) {
      throw str;
    }
  };
})();
