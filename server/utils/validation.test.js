const expect = require('expect');

var {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        var res = isRealString(12345);
        expect(res).toBe(false);
    });

    it('should reject strings with only spaces', () => {
        var res = isRealString('      ');
        expect(res).toBe(false);
    });

    it('should allow string with non-space characters', () => {
        var res = isRealString('Hi there.');
        expect(res).toBe(true);
    });
});
