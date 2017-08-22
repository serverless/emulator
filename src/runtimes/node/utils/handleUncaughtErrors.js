export default function handleUncaughtErrors(channel) {
  process.on('uncaughtException', (err) => {
    channel.emit({
      type: 'error',
      data: err
    });
  });

  process.on('unhandledRejection', (reason, p) => {
    channel.emit({
      type: 'error',
      data: reason
    });
  });
}
