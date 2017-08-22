export default function isProvider(provider, data) {
  return data.functionConfig.provider && data.functionConfig.provider === provider;
}
