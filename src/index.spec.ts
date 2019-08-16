import invision from './index';

test('invision should be defiend', () => {
    expect(invision).toBeDefined();
});

test('should send message', async (done) => {

    const msg = {message : 'test', data : 'the data'};

    window.postMessage({
        source: 'pb_invision',
        type: 'com_config',
        messageAddress: 'http://localhost/test',
        targetOrigin: 'http://localhost/test'
    }, '*');

    window.parent.postMessage = jest.fn((data) => {        
        expect(data).toHaveProperty('messageAddress');
        expect(data).toHaveProperty('message');
        expect(data.messageAddress).toEqual('http://localhost/test');
        expect(data.message).toEqual(msg);
        done();
    })

    await new Promise(resolve => setTimeout(resolve, 100));

    invision.sendMessage(msg);
});
