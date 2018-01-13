#define mem\
  chip8.CstrMem

// 0x000 - 0x1fff reserved for interpreter
// 0x200 - 0xffff start/end

#define ioZero(mem, size)\
  for (var i=0; i<size; i++) {\
    mem[i] = 0;\
  }
