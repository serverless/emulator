import minimist from 'minimist';

export default function loadConfig() {
  const slice = R.test(/^--inspect/, process.argv[1]) ? 3 : 2;
  const args = minimist(process.argv.slice(slice));
  return args;
}
