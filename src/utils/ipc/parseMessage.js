export default function parseMessage(data, defaultType) {
  let message;
  try {
    message = JSON.parse(data);
  } catch(error) {
    message = { type: defaultType, data };
  }
  return message;
}
