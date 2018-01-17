#define __id\
  ((opcode>>>12)&0xf)

#define __h\
  ((opcode>>>8)&0xf)

#define __v\
  ((opcode>>>4)&0xf)

#define __nnn\
  (opcode&0xfff)

#define __kk\
  (opcode&0xff)

#define __n\
  (opcode&0xf)

chip8.CstrProcessor = (function() {
  // General purpose
  var v = [], pc, i, timer;

  // CPU step
  function step() {
    var opcode = mem.read.uh(pc);
    pc+=2;

    // Console
    console.dir(emu.hex(opcode));

    switch(__id) {
      // case 0x1:
      //   pc = __nnn;
      //   break;

      case 0x3:
        if (v[__h] === __kk) {
          pc+=2;
        }
        break;

      case 0x6:
        v[__h] = __kk;
        break;

      case 0x7:
        v[__h] += __kk;
        break;

      case 0xa:
        i = __nnn;
        break;

      case 0xc:
        v[__h] = Math.floor(Math.random() * 256) & __kk;
        break;

      case 0xd:
        console.dir(__h);
        console.dir(__v);
        console.dir('BYTE -> '+__n);

        // Read from I until I+__n from ram
        // Render v[__h], v[__v]
        for (var pt=i; pt<i+__n; pt++) {
          var hah = mem.read.ub(pt);
          console.dir('draw -> '+emu.hex(hah));
        }
        break;

      default:
        emu.exit('Unknown opcode -> '+emu.hex(opcode));
        break;
    }
  }

  return {
    reset: function() {
      ioZero(v, 16);

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
