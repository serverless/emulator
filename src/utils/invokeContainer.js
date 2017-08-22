/* eslint-disable no-use-before-define */
/* eslint-disable max-len */

import BbPromise from 'bluebird';

export default async function invokeContainer(container, payload) {
  const { channel } = container;

  const message = {
    type: 'invoke',
    data: {
      payload
    }
  };

  channel.send(message);
  const response = await BdPromise.any([
    waitForResponse(channel),
    waitForError(container),
  ]);

  console.log('invoke response:', response)
  container.close();
  return response;
}

async function waitForResponse(channel) {
  return new BbPromise((resolve) => {
    channel.once('response', message => resolve(message));
  });
}

async function waitForError(container) {
  return new BbPromise((resolve) => {
    container.once('error', error => resolve(message));
  });
}
