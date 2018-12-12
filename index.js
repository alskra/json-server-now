const path = require('path');
const jsonServer = require('json-server-relationship');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const port = 3000;

server.use(middlewares);

// Add `singular` query
server.use((req, res, next) => {
	const _send = res.send;

	res.send = function (body) {
		if (require('url').parse(req.originalUrl, true).query['singular']) {
			try {
				const json = JSON.parse(body);

				if (Array.isArray(json)) {
					if (json.length === 1) {
						return _send.call(this, JSON.stringify(json[0], null, 2));
					} else if (json.length === 0) {
						return _send.call(this, '{}', 404);
					}
				}
			} catch (e) {}
		}

		return _send.call(this, body);
	};

	next();
});

// Add custom routes
server.use(jsonServer.rewriter({
	'/list/:id': '/posts/:id', // example
}));

server.use(router);

server.listen(port, () => {
	console.log('JSON Server is running, port:', port);
});
