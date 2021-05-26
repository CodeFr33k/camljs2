import csp from '../js-csp/index.js';

export default (chan) => {
    const result = csp.chan();
    const chan2 = csp.go(function*() {
        while(true) {
            const text = yield csp.take(chan);
            if(text === csp.CLOSED) {
                chan2.close();
                result.close();
                return;
            }
            const recordsAsText = text.split('\n\n'); 
            for(const recordAsText of recordsAsText) {
                if(recordAsText === '') {
                    continue;
                }
                const lines = recordAsText.split('\n');
                lines.push('');
                const username = /username = (.*)/.exec(recordAsText);
                const created = /created = (.*)/.exec(recordAsText);
                const token = /token = (.*)/.exec(recordAsText);
                const image = /@image = (.*)/.exec(recordAsText);
                const record = {
                    lines,
                    username: username && username[1],
                    created: created && created[1],
                    token: token && token[1],
                    image: image && image[1],
                };
                yield csp.put(result, record); 
            }
        }
    });
    return result;
};

