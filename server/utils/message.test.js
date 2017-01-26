var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        var from = "me",
            text = "hi there";

        var res = generateMessage(from, text);

        expect(res).toInclude({from, text});
        expect(res.createdAt).toBeA('number');

    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var from = "me",
            latitude = "1",
            longitude = "2",
            url = `https://www.google.com/maps?q=1,2`;

        var res = generateLocationMessage(from, latitude, longitude);

        expect(res.from).toBe(from);
        expect(res.url).toBe(url);
    });
});
