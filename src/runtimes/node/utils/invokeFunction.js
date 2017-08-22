export default async function invokeFunction(func, data, provider, channel) {
  try {
    provider.invoke(func, data);
  } catch(error) {

  }
}
