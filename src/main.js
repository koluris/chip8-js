// 0x000 - 0x1fff reserved for interpreter
// 0x200 - 0xffff start/end

var chip8 = (function() {
  // General purpose
  var v = [], pc, i, timer;

  function read(pc) {
    exit('Mem read -> '+pc);
  }

  function exit(str) {
    throw str;
  }

  return {
    reset: function() {
      for (var i=0; i<16; i++) {
        v[i] = 0;
      }

      pc = 0x200;
      i  = 0;

      // Timers
      timer = {
        root: 0, sound: 0
      };

      // Run
      read(pc);
    }
  }
})();
