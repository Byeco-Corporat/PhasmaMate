const fastify = require('fastify')({ logger: true });
const path = require('path');
const fs = require('fs').promises;
const ejs = require('ejs');

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

fastify.register(require('@fastify/view'), {
  engine: { ejs: ejs },
  templates: 'public',
});


fastify.get('/', async (request, reply) => {
  return reply.view('index.ejs', { title: 'PhasmaMate | Byeco' });
});




const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`Server running at http://localhost:3000/`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();