const cryptoHash=require('./crypto-hash');

describe('cryptoHash()',()=>{
  it('generates a sha256 hashed output',()=>{
    expect(cryptoHash('foo')).toEqual('2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae')
  });
  it('produces the same hash with the same input in any orser',()=>{
    expect(cryptoHash('one', 'tow', 'three')).toEqual(cryptoHash('three', 'tow', 'one'))
  });
})