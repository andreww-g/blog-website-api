import tracer from 'dd-trace';

tracer.init({
  service: 'blog-website-api',
  env: process.env.NODE_ENV,
  version: '1.0',
  logInjection: true,
  hostname: 'localhost',
  port: 8126,
});

export default tracer;
