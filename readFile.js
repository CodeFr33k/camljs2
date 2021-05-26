import csp from '../js-csp/index.js';
import fs from 'fs';

export default function(chan) {
    const result = csp.chan();
    const chan2 = csp.go(function*() {
        while(true) {
            const filename = yield csp.take(chan);
            if(filename === csp.CLOSED || filename === '') {
                chan2.close();
                result.close();
                return;
            }
            const buffer = fs.readFileSync(filename);
            const text = buffer.toString();
            csp.putAsync(result, text);
        }
    });
    return result;
}

