const crypto = require('crypto');

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return { index: 0, timestamp: Date.now(), data: 'Genesis Block', previousHash: '0', hash: this.calculateHash('Genesis Block') };
  }

  calculateHash(data, previousHash = '') {
    return crypto.createHash('sha256').update(previousHash + Date.now() + JSON.stringify(data)).digest('hex');
  }

  addBlock(data) {
    const previousBlock = this.chain[this.chain.length - 1];
    const newBlock = {
      index: this.chain.length,
      timestamp: Date.now(),
      data,
      previousHash: previousBlock.hash,
      hash: this.calculateHash(data, previousBlock.hash)
    };
    this.chain.push(newBlock);
    return newBlock;
  }
}

module.exports = Blockchain;
