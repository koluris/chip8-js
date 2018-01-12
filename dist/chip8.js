





// 0x000 - 0x1fff reserved for interpreter
// 0x200 - 0xffff start/end

var chip8 = (function() {
  // General purpose
  var v = [], mem = [], pc, i, timer;

  // Read app
  function app(path, fn) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      fn(xhr.response);
    };
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', path);
    xhr.send();
  }

  function read(pc) {
    if (pc >= 0x200 && pc <= 0xfff) {
      return mem[pc];
    }
    else {
      exit('Unknown mem read -> '+pc);
    }
  }

  function step() {
    var opcode = read(pc);
    pc++;

    switch(opcode) {
      default:
        exit('Unknown opcode -> '+opcode);
        break;
    }
  }

  function exit(str) {
    throw str;
  }

  return {
    reset: function() {
      for (var i=0; i<16; i++) {
        v[i] = 0;
      }

      for (var i=0; i<0xfff; i++) {
        mem[i] = 0;
      }

      pc = 0x200;
      i  = 0;

      // Timers
      timer = {
        root: 0, sound: 0
      };

      // Game
      app('bin/BRIX', function(resp) {
        exit(resp);

        // Run
        step();
      });
    }
  }
})();

