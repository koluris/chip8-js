










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
      chip8.CstrGraphics.reset('#canvas');

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

    bin: function(number) {
      return number.toString(2);
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
    var opcode = chip8.CstrMem.read.uh(pc);
    pc+=2;

    // Console
    console.dir(chip8.CstrMain.hex(opcode));

    switch(((opcode>>>12)&0xf)) {
      case 0x1:
        pc = (opcode&0xfff);
        break;

      case 0x3:
        if (v[((opcode>>>8)&0xf)] === (opcode&0xff)) {
          pc+=2;
        }
        break;

      case 0x6:
        v[((opcode>>>8)&0xf)] = (opcode&0xff);
        break;

      case 0x7:
        v[((opcode>>>8)&0xf)] += (opcode&0xff);
        break;

      case 0xa:
        i = (opcode&0xfff);
        break;

      case 0xc:
        v[((opcode>>>8)&0xf)] = Math.floor(Math.random() * 256) & (opcode&0xff);
        break;

      case 0xd:
        console.dir(((opcode>>>8)&0xf));
        console.dir(((opcode>>>4)&0xf));
        console.dir('BYTE -> '+(opcode&0xf));

        // Read from I until I+(opcode&0xf) from ram
        // Render v[((opcode>>>8)&0xf)], v[((opcode>>>4)&0xf)]
        for (var pt=i; pt<i+(opcode&0xf); pt++) {
          var hah = chip8.CstrMem.read.ub(pt);
          console.dir('draw -> '+chip8.CstrMain.bin(hah));
        }
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
      step();
      window.requestAnimationFrame(chip8.CstrProcessor.start);
    }
  }
})();
chip8.CstrMem = (function() {
  var ram = [];

  // Fonts
  var fonts = [
    [0xf, 0x9, 0x9, 0x9, 0xf],
    [0x2, 0x6, 0x2, 0x2, 0x7],
    [0xf, 0x1, 0xf, 0x8, 0xf],
    [0xf, 0x1, 0xf, 0x1, 0xf],
    [0x9, 0x9, 0xf, 0x1, 0x1],
    [0xf, 0x8, 0xf, 0x1, 0xf],
    [0xf, 0x8, 0xf, 0x9, 0xf],
    [0xf, 0x1, 0x2, 0x4, 0x4],
    [0xf, 0x9, 0xf, 0x9, 0xf],
    [0xf, 0x9, 0xf, 0x1, 0xf],
    [0xf, 0x9, 0xf, 0x9, 0x9],
    [0xe, 0x9, 0xe, 0x9, 0xe],
    [0xf, 0x8, 0x8, 0x8, 0xf],
    [0xe, 0x9, 0x9, 0x9, 0xe],
    [0xf, 0x8, 0xf, 0x8, 0xf],
    [0xf, 0x8, 0xf, 0x8, 0x8]
  ];

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

    read: {
      uh: function(addr) {
        if (addr >= 0x200 && addr <= 0xfff) {
          return (ram[addr]<<8) | ram[addr+1];
        }
        
        exit('Unknown Read 16 -> '+addr);
        return 0;
      },

      ub: function(addr) {
        if (addr >= 0x200 && addr <= 0xfff) {
          return ram[addr];
        }

        exit('Unknown Read 08 -> '+addr);
        return 0;
      }
    }
  };
})();
chip8.CstrGraphics = (function() {
  var canvas, ctx;

  return {
    reset: function(divCanvas) {
      canvas = $(divCanvas)[0];
      ctx = canvas.getContext('2d');

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

