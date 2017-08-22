import R from 'ramda';

export default function middleware(middlewares) {
  middlewares = R.map((middle) => (next) => (event) => middle(event, next), middlewares);
  const midfn = R.apply(R.compose, middlewares);
  return (fn) => midfn(fn);
}
