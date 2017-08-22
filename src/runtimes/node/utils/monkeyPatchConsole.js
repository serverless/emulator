export default function monkeyPatchConsole(channel) {
  console.log = (...args) => channel.emit({
    type: 'log',
    data: { args },
  });
}
