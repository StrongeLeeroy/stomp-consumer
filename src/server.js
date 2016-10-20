import util from 'util';
import stomp from 'stomp';
import config from '../config/sample_config';

const client = new stomp.Stomp(config);

var headers = {
    destination: config.topic,
    ack: 'client'
};

var messages = 0;

console.log('Connecting to socket...');
client.connect();

function message_callback(body, headers) {
    console.log('|-- Message callback --|');
    console.log('Headers: ' + sys.inspect(headers));
    console.log('Body: ' + body);
}

client.on('connected', () => {
    client.subscribe(headers, message_callback);
    console.log('Connected.');
});

client.on('disconnected', () => {
    console.log('Disconnected from socket.');
    console.log('Reattempting connection...');
    client.connect();
});

client.on('message', function(message) {
    console.log("Got message: " + message.headers['message-id']);
    client.ack(message.headers['message-id']);
    messages++;
});

client.on('error', function(error_frame) {
    console.log('An error ocurred.');
    console.log(error_frame);
    client.disconnect();
});

process.on('SIGINT', function() {
    console.log('\nConsumed ' + messages + ' messages');
    client.disconnect();
});