import readRecordFromText from './readRecordFromText.ts';
import csp from '../js-csp';

it('abc', async (done) => {
    const chan = csp.chan();
    csp.putAsync(chan, 'abc\n\ndef\n\n');
    const result = readRecordFromText(chan);
    csp.go(function*() {
        const record = yield csp.take(result);
        expect(record.lines).toEqual(expect.arrayContaining([
            'abc',
            '',
        ]));
        done();
    });
});

