import R from 'ramda';
import parseMessage from './parseMessage';

export default function parseMessages(data, defaultType) {
  const str = data.toString('utf8');
  // TODO makes sure this doesn't affect escaped newlines inside event content
  const lines = str.split(/\r?\n/g);
  return R.map(data => parseMessage(data, defaultType), lines);
}
