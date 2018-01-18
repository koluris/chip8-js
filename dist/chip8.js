











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
    reset: function(app) {
         chip8.CstrMem.reset();
         chip8.CstrProcessor.reset();
      chip8.CstrGraphics.reset('#canvas');

      // Game
      request('bin/'+app, function(resp) {
        // Write app to chip8.CstrMem
        chip8.CstrMem.upload(resp);

        // Start emulation
        chip8.CstrProcessor.stop();
        chip8.CstrProcessor.start();
      });
    },

    // Convert to hex
    hex: function(number) {
      return '0x'+(number>>>0).toString(16);
    },

    pixelData: function(number) {
      var temp = number.toString(2);

      while (temp.length < 8) {
        temp = '0' + temp;
      }
      return temp.split("");
    },
    
    // Generic output function
    exit: function(str) {
      chip8.CstrProcessor.stop();
      throw str;
    }
  };
})();


















chip8.CstrProcessor = (function() {
  // General purpose
  var v = [], pc, i, timer;
  var requestAF;

  // CPU step
  function step() {
    var opcode = chip8.CstrMem.read.uh(pc);
    pc+=2;

    // Console
    console.dir(chip8.CstrMain.hex(opcode));

    switch(((opcode>>>12)&0xf)) {
      case 0x0:
        switch((opcode&0xff)) {
          case 0xe0:
            chip8.CstrGraphics.clear();
            return;
        }
        chip8.CstrMain.exit('Unknown opcode 0x0 -> '+chip8.CstrMain.hex(opcode));
        return;

      case 0x1:
        pc = (opcode&0xfff);
        return;

      case 0x3:
        if (v[((opcode>>>8)&0xf)] === (opcode&0xff)) {
          pc+=2;
        }
        return;

      case 0x4:
        if (v[((opcode>>>8)&0xf)] !== (opcode&0xff)) {
          pc+=2;
        }
        return;

      case 0x6:
        v[((opcode>>>8)&0xf)] = (opcode&0xff);
        return;

      case 0x7:
        v[((opcode>>>8)&0xf)] += (opcode&0xff);
        return;

      case 0x8:
        switch((opcode&0xf)) {
          case 0x0:
            v[((opcode>>>8)&0xf)] = v[((opcode>>>4)&0xf)];
            return;

          case 0x2:
            v[((opcode>>>8)&0xf)] &= v[((opcode>>>4)&0xf)];
            return;

          case 0x3:
            v[((opcode>>>8)&0xf)] ^= v[((opcode>>>4)&0xf)];
            return;
        }
        chip8.CstrMain.exit('Unknown opcode 0x8 -> '+chip8.CstrMain.hex(opcode));
        return;

      case 0xa:
        i = (opcode&0xfff);
        return;

      case 0xc:
        v[((opcode>>>8)&0xf)] = Math.floor(Math.random() * 256) & (opcode&0xff);
        return;

      case 0xd:
        for (var pt=i; pt<i+(opcode&0xf); pt++) {
          var chunk  = chip8.CstrMem.read.ub(pt);
          var pixels = chip8.CstrMain.pixelData(chunk);

          for (var pos=0; pos<pixels.length; pos++) {
            if (pixels[pos] === '1') { // TODO: XOR check
              chip8.CstrGraphics.draw(v[((opcode>>>8)&0xf)]+pos, v[((opcode>>>4)&0xf)]+(pt-i));
            }
          }
        }
        return;

      case 0xf:
        switch((opcode&0xff)) {
          case 0x07:
            v[((opcode>>>8)&0xf)] = timer.root;
            return;

          case 0x15:
            timer.root = v[((opcode>>>8)&0xf)];
            return;

          case 0x55:
            for (var pt=0; pt<((opcode>>>8)&0xf); pt++) {
              chip8.CstrMem.write.ub(i, v[pt]);
            }
            return;

          case 0x65:
            for (var pt=i; pt<i+0xf; pt++) {
              v[pt] = chip8.CstrMem.read.ub(pt);
            }
            return;

          case 0x1e:
            i += v[((opcode>>>8)&0xf)];
            return;
        }
        chip8.CstrMain.exit('Unknown opcode 0xf -> '+chip8.CstrMain.hex(opcode));
        return;
    }
    chip8.CstrMain.exit('Unknown opcode -> '+chip8.CstrMain.hex(opcode));
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
      requestAF = requestAnimationFrame(chip8.CstrProcessor.start);
    },

    stop: function() {
      cancelAnimationFrame(requestAF);
      requestAF = undefined;
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

    write: {
      ub: function(addr, data) {
        if (addr >= 0x200 && addr <= 0xfff) {
          ram[addr] = data;
          return;
        }
        exit('Unknown Read 16 -> '+addr);
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

      chip8.CstrGraphics.clear();
    },

    clear: function() {
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

