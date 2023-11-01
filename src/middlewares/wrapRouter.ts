import { Router } from 'express';
import { CatchAsync } from './catchAsyncErrors';

const wrapRouter = (router: Router) => {
	const wrappedRouter = Router();

	for (const layer of router.stack) {
		if (layer.route) {
			for (const method in layer.route.methods) {
				if (layer.route.methods[method]) {
					const path = layer.route.path;
					const handlers = layer.route.stack.map((layer) => layer.handle);

					wrappedRouter[method](
						path,
						handlers.map((handler) => CatchAsync.wrap(handler))
					);
				}
			}
		}
	}

	return wrappedRouter;
};

export { wrapRouter };
