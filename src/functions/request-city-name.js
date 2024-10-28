const { app } = require('@azure/functions');

app.http('request-city-name', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const name = request.query.get('name') || await request.text() || 'world';

        return { body: `Hello, ${name}! This has been updated from pipeline. Another test here` };
    }
});
