const { array } = require("yargs");
const Block = require("./block");
const Blockchain = require("./blockchain");
const cryptoHash=require('./crypto-hash');

describe('Blockchain', ()=>{
   let blockchain=new Blockchain();
   let newChain=new Blockchain();
   let originalChain=new Blockchain();


   beforeEach(()=>{
      blockchain=new Blockchain();
      newChain=new Blockchain();
   originalChain=blockchain.chain;
   });



   it('contains a `chain` Array instance', ()=>{
    expect(blockchain.chain instanceof Array).toBe(true)
   });
   it('starts with the genesis block', ()=>{
    expect(blockchain.chain[0]).toEqual(Block.genesis())
   });
   it('adds a new block to the chain', ()=>{
    const newData='foo bar';
    blockchain.addBlock({data:newData});
    expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
   });



   describe('isValidCain()', ()=>{
      describe('when the chain dose not start with the genesise block', ()=>{
         it('return false',()=>{
                       blockchain.chain[0]={data:'fake-genesis'};
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
         });
      });



      describe('when the chain dose start with the genesise block and has multiple block', ()=>{

         beforeEach(()=>{

            blockchain.addBlock({data:'one'});
            blockchain.addBlock({data:'tow'});
            blockchain.addBlock({data:'three'});
         });

         describe('and a lastHash refrence ahas changed', ()=>{
            it('return false',()=>{
              
               blockchain.chain[2].lastHash='broken-lastHash';
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
         });
         describe('and the chain contains a block with an invalid field', ()=>{
            it('return false',()=>{
      
              blockchain.chain[2].data='changed-data';
               expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
         });
         describe('and a chain dose not contain any invalid blocks', ()=>{
            it('return true',()=>{

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);

            });
         });
      });
      describe('and the chain contains a block with a jumped difficulty', ()=>{
         it('return false',()=>{

             const lastBlock=blockchain.chain[blockchain.chain.length-1];
             const lastHash=lastBlock.hash;
             const timestamp=Date.now();
             const nonce=0;
             const data=[];
             const difficulty=lastBlock.difficulty - 3;
             const hash=cryptoHash(timestamp, lastHash, difficulty, nonce, data );
             const badBlock=new Block({
               timestamp, lastHash, hash, difficulty, nonce, data 
             });
             blockchain.chain.push(badBlock);

             expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);

         });
      });
   });
  

   
describe ('replaceChain()',()=>{

let errorMock, logMock;
beforeEach(()=>{
   errorMock=jest.fn();
   logMock=jest.fn();
   global.console.log=logMock;
   global.console.error=errorMock;
});


describe ('when the new chain is not longer',()=>{
   beforeEach(()=>{
      newChain[0]={new:'chain'};
      blockchain.replaceChain(newChain.chain);
   })
     it('dose not replace the chain',()=>{
     expect(blockchain.chain).toEqual(originalChain);
   });
     it('logs  an error ',()=>{  
     expect(errorMock).toHaveBeenCalled();
   });
});

describe ('when the new chain is longer',()=>{
    
   beforeEach(()=>{
      newChain.addBlock({data:'one'});
      newChain.addBlock({data:'tow'});
      newChain.addBlock({data:'three'});
   });
   describe ('and the chain is invalid',()=>{
      beforeEach(()=>{
         newChain.chain[2].hash='fake-hash';
         blockchain.replaceChain(newChain.chain);
      });
      it('dose not replace the chain',()=>{
         expect(blockchain.chain).toEqual(originalChain);
      });
      it('logs  an error ',()=>{  
         expect(errorMock).toHaveBeenCalled();
       });
   });
   
   describe ('and the chain is valid',()=>{ 
      beforeEach(()=>{
         blockchain.replaceChain(newChain.chain);
      });
      it('dose  replace the chain',()=>{
         expect(blockchain.chain).toEqual(newChain.chain);
      });
      it('logs  an error ',()=>{  
         expect(logMock).toHaveBeenCalled();
       });
   });
});
    
});


});