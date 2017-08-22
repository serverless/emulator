import path from 'path';
import childProcess from 'child_process';
import EventEmitter from 'events';
import R from 'ramda';
import getRuntimeScriptName from './getRuntimeScriptName';
import getRuntimeExecName from './getRuntimeExecName';
import getFunctionCodeDirectoryPath from './getFunctionCodeDirectoryPath';
import loadMiddlewares from './loadMiddlewares';
import middleware from './middleware';
import createChannel from './ipc/createChannel';

const runtimesDir = path.join(__dirname, '..', 'runtimes');

export default async function loadContainer(functionId, functionConfig, containerConfig) {
  const middlewares = await loadMiddlewares('load');
  const loader = middleware(middlewares)(createContainer);
  return await loader({ functionId, functionConfig, containerConfig, execArgs: [] });
}

const createContainer = (data) => {
  const { functionId, functionConfig, functionPropPath, functionFileName } = data;
  const { provider, runtime } = functionConfig;
  const script = getRuntimeScriptName(runtime);
  const exec = getRuntimeExecName(runtime);
  const pathToScript = path.join(runtimesDir, script);
  const pathToFunctionCode = getFunctionCodeDirectoryPath(functionId);
  const emitter = new EventEmitter();
  const functionFilePath = path.join(pathToFunctionCode, functionFileName)

  // combine provider env vars with the function specific env vars
  const env = R.merge(data.env, functionConfig.env);
  const execArgs = data.execArgs.concat([
    `${pathToScript}`,
    `--functionFilePath=${functionFilePath}`,
    `--functionPropPath=${functionPropPath}`,
    `--provider=${provider}`,
  ]);

  const childProc = childProcess.spawn(
    exec,
    execArgs,
    { env },
  );

  const channel = createChannel(childProc);

  channel.on('log', (message) => {
    console.log(...message.data.args);
  });

  let closed = false;
  const close = () => {
    if (!closed) {
      closed = true;
      if (!childProc.killed) {
        childProc.kill();
      }
      childProc.removeAllListeners();
      childProc.stdin.removeAllListeners();
      childProc.stdout.removeAllListeners();
      childProc.stderr.removeAllListeners();
      channel.removeAllListeners();
      emitter.emit('close');
      emitter.removeAllListeners();
    }
  };

  childProc.on('close', () => {
    close();
  });

  childProc.on('error', () => {
    emitter.emit('error', {
      message: 'error occurred in container'
    })
  });

  const on = (type, fn) => {
    emitter.on(type, fn);
  };

  return {
    channel,
    close,
    on,
    process: childProc,
    runtime,
  };
};
