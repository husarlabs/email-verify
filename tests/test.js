var assert = require("assert")

describe('email-verify', function(){
  this.timeout(5000);
  var verifier = require( '../index.js' );

  describe('#verify()', function(){
    it('should respond with an object where success is true', function(done){
      verifier.verify("rob@below.io", function(info,err){
        assert(info.success);
        done();
      });
    })
    it('should respond with an object where success is false', function(done){
      verifier.verify("antirob@below.io", function(info,err){
        assert(!info.success);
        done();
      });
    })
    it('should respond with an object where success is false', function(done){
      verifier.verify("badlyformed##email@email@.com", function(info,err){
        assert(!info.success);
        done();
      });
    })
  })
})