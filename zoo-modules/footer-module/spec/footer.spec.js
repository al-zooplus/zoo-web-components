// import Footer from '../Footer.html';
// TODO come up with something to instantiate the component and test it 

var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

describe('Header', function() {
	it('should should create', function() {
		const app = document.getElementById('app');
		app.appendChild("<zoo-log-header></zoo-log-header>");
	});
});

