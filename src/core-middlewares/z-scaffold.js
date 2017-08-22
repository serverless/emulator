// this is an example / scaffold to show how the middlewares concept works

const load = async (data, next) => await next(data);

const invoke = async (data, next) => await next(data);

export { load, invoke };
