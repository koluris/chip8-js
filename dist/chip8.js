









var chip8 = {};







// 0x000 - 0x1fff reserved for interpreter
// 0x200 - 0xffff start/end





chip8.CstrMain = (function() {
  // ROM read request
  function request(path, fn) {
    var xhr = new XMLHttpRequest();

    // Success
    xhr.onload = function() {
      fn(xhr.response);
    };

    xhr.responseType = 'arraybuffer';
    xhr.open('GET', path);
    xhr.send();
  }

  return {
    reset: function() {
      chip8.CstrMem.reset();
      chip8.CstrProcessor.reset();

      // Game
      request('bin/MAZE', function(resp) {
        // Write app to chip8.CstrMem
        chip8.CstrMem.upload(resp);

        // Start emulation
        chip8.CstrProcessor.start();
      });
    },

    // Convert to hex
    hex: function(number) {
      return '0x'+(number>>>0).toString(16);
    },
    
    // Generic output function
    exit: function(str) {
      throw str;
    }
  };
})();









chip8.CstrProcessor = (function() {
  // General purpose
  var v = [], pc, i, timer;

  // CPU step
  function step() {
    var opcode = chip8.CstrMem.read(pc);
    pc+=2;

    // Console
    console.dir(chip8.CstrMain.hex(opcode));

    switch(((opcode>>>12)&0xf)) {
      case 6:
        v[((opcode>>>8)&0xf)] = (opcode&0xff);
        break;

      default:
        chip8.CstrMain.exit('Unknown opcode -> '+chip8.CstrMain.hex(opcode));
        break;
    }
  }

  return {
    reset: function() {
      for (var i=0; i< 16; i++) { v[i] = 0; };

      // Start of Chip 8 apps
      pc = 0x200;
      i  = 0;

      // Timers
      timer = {
        root: 0, sound: 0
      };
    },

    start: function() {
      while(1) {
        step();
      }
    }
  }
})();
chip8.CstrMem = (function() {
  var ram = [];

  return {
    reset: function() {
      for (var i=0; i< 0x1000; i++) { ram[i] = 0; };
    },

    upload: function(resp) {
      // Read app as Uint8
      var data = new Uint8Array(resp);

      // Write to chip8.CstrMem
      for (var i=0; i<data.byteLength; i++) {
        ram[0x200 + i] = data[i];
      }
    },

    read: function(addr) {
      if (addr >= 0x200 && addr <= 0xfff) {
        return (ram[addr]<<8) | ram[addr+1];
      }
      
      exit('Unknown mem read -> '+addr);
      return 0;
    }
  };
})();

