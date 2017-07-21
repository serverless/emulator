// this is an example / scaffold to show how the middlewares concept works

const preInvoke = data => Promise.resolve(data);
const postInvoke = data => Promise.resolve(data);

export { preInvoke, postInvoke };
