chip8.CstrMem = (function() {
  var ram = [];

  return {
    reset: function() {
      ioZero(ram, 0x1000);
    },

    upload: function(resp) {
      // Read app as Uint8
      var data = new UintBcap(resp);

      // Write to mem
      for (var i=0; i<data.bLen; i++) {
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
