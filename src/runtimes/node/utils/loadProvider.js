export default function loadProvider(config) {
  const { provider } = config;
  return require(`../providers/${provider}`)();
}
