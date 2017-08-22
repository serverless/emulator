import EventEmitter from 'events';
import R from 'ramda';
import parseMessages from './parseMessages';

export default function createChannel(process) {
  const emitter = new EventEmitter();

  process.stdout.on('data', (data) => {
    const messages = parseMessages(data, 'log');
    R.forEach(message => emitter.emit(message.type, message), messages);
  });
  process.stderr.on('data', (data) => {
    const messages = parseMessages(data, 'error');
    R.forEach(message => emitter.emit(message.type, message), messages);
  });
  process.stdin.setEncoding('utf-8');

  const on = (type, fn) => {
    emitter.on(type, fn);
  };

  const once = (type, fn) => {
    emitter.once(type, fn);
  }

  const emit = (message) => {
    process.stdout.write(JSON.stringify(message));
  };

  const send = (message) => {
    process.stdin.write(JSON.stringify(message));
  };

  const removeAllListeners = () => emitter.removeAllListeners();

  return {
    emit,
    on,
    once,
    removeAllListeners,
    send,
  };
}
