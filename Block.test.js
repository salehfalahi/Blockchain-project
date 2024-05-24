
const { GENESIS_DATA , MINE_RATE} = require("./config");
const Block = require("./block");
const createHash = require("./crypto-hash");
const hexToBinary = require("hex-to-binary");

describe("Block",()=>{
const timestamp=2000;
const lastHash='foo-hash';
const hash='bar-hash';
const data =['blockchain','data'];
const difficulty = 1;
const nonce = 1;
const block=new Block({
  timestamp,
  lastHash,
  hash,
  data,
  difficulty,
  nonce
});
it("has a timestamp,lasthash , hash and data property",()=>{
expect(block.timestamp).toEqual(timestamp);
expect(block.lastHash).toEqual(lastHash);
expect(block.hash).toEqual(hash);
expect(block.data).toEqual(data); 
expect(block.difficulty).toEqual(difficulty); 
expect(block.nonce).toEqual(nonce); 
});

describe('genesis()',()=>{
  const genesisblock = Block.genesis();
  it("return a block instance",()=>{
      expect(genesisblock instanceof Block).toEqual(true);
  });

  it("return the genesis data",()=>{
    expect(genesisblock).toEqual(GENESIS_DATA);
});
});

describe('minedBlock()',()=>{
  const lastBlock=Block.genesis();
  const data='mined data';
  const minedBlock=Block.minedBlock({lastBlock,data});

  it('return a  block instance', ()=>{
    expect(minedBlock instanceof Block).toEqual(true);
  });
  it('sets the `lastHash`to the `hash`of the lastBlock', ()=>{
    expect(minedBlock.lastHash).toEqual(lastBlock.hash);
  });
  it('sets the `data`', ()=>{
    expect(minedBlock.data).toEqual(data);
  });
  it('sets the `timestamp`', ()=>{
    expect(minedBlock.timestamp).not.toEqual(undefined);
  });
  it('creates a SHA256 `hash` based on the proper inputs', ()=>{
   expect(minedBlock.hash).toEqual(createHash(minedBlock.timestamp, minedBlock.difficulty, minedBlock.nonce, lastBlock.hash, data)); 
  });

  it('set a `hash` that maces the difficulty criteria', () => {
    expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
});
it('adjust the difficulty', () => {
  const possibleResults =[lastBlock.difficulty + 1 , lastBlock.difficulty - 1]
  expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
});
});


   describe('adjustDifficulty()',()=>{
    it("raises the difficulty for a quickly mined block",()=>{
      expect(Block.adjustDifficulty(
        {
          originalBlock:block,
        timestamp:block.timestamp + MINE_RATE - 100
      })).toEqual(block.difficulty + 1);
    });
    it("lowers the difficulty for a slowly mined block",()=>{
      expect(Block.adjustDifficulty({
        originalBlock:block,
        timestamp:block.timestamp + MINE_RATE + 100
      })).toEqual(block.difficulty - 1);
    }); 
    it('has lower limit of 1', () => {
      block.difficulty= -1;
      expect(Block.adjustDifficulty({originalBlock:block})).toEqual(1);
  });
 
   });



});