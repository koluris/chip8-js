#define id\
  ((opcode>>>12)&0xf)

#define h\
  ((opcode>>>8)&0xf)

#define kk\
  (opcode&0xff)

chip8.CstrProcessor = (function() {
  // General purpose
  var v = [], pc, i, timer;

  // CPU step
  function step() {
    var opcode = mem.read(pc);
    pc+=2;

    // Console
    console.dir(emu.hex(opcode));

    switch(id) {
      case 6:
        v[h] = kk;
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
