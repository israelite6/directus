import { defineOperationApi } from '@directus/utils';
import { randUuid } from '@ngneat/falso';
import axios from 'axios';
// import { createRequire } from 'node:module';

// const require = createRequire(import.meta.url);
// const ivm = require('isolated-vm');

type Options = {
	code: string;
};

/**
 * A helper for making the logs prettier.
 * The logger prints arrays with their indices but this looks "bad" when you have only one argument.
 */
// function unpackArgs(args: any[]) {
// 	return args.length === 1 ? args[0] : args;
// }

// export default defineOperationApi<Options>({
// 	id: 'exec',
// 	handler: async ({ code }, { data, env, logger, database, services }) => {
// 		console.log('first', data);
// 		const allowedEnv = data['$env'] ?? {};
// 		const isolateSizeMb = env['FLOWS_RUN_SCRIPT_MAX_MEMORY'];
// 		const scriptTimeoutMs = env['FLOWS_RUN_SCRIPT_TIMEOUT'];

// 		const isolate = new ivm.Isolate({ memoryLimit: isolateSizeMb });
// 		const context = isolate.createContextSync();
// 		const jail = context.global;
// 		jail.setSync('global', jail.derefInto());
// 		jail.setSync('process', { env: allowedEnv }, { copy: true });
// 		jail.setSync('module', { exports: null }, { copy: true });

// 		jail.setSync(
// 			'console',
// 			{
// 				log: new ivm.Callback((...args: any[]) => logger.info(unpackArgs(args)), { sync: true }),
// 				info: new ivm.Callback((...args: any[]) => logger.info(unpackArgs(args)), { sync: true }),
// 				warn: new ivm.Callback((...args: any[]) => logger.warn(unpackArgs(args)), { sync: true }),
// 				error: new ivm.Callback((...args: any[]) => logger.error(unpackArgs(args)), { sync: true }),
// 				trace: new ivm.Callback((...args: any[]) => logger.trace(unpackArgs(args)), { sync: true }),
// 				debug: new ivm.Callback((...args: any[]) => logger.debug(unpackArgs(args)), { sync: true }),
// 			},
// 			{ copy: true }
// 		);

// 		// Run the operation once to define the module.exports function
// 		await context.eval(code, { timeout: scriptTimeoutMs });

// 		const inputData = new ivm.ExternalCopy({ data });

// 		const resultRef = await context.evalClosure(`return module.exports($0.data)`, [inputData.copyInto()], {
// 			result: { reference: true, promise: true },
// 			timeout: scriptTimeoutMs,
// 		});

// 		const result = await resultRef.copy();

// 		// Memory cleanup
// 		resultRef.release();
// 		inputData.release();
// 		context.release();
// 		isolate.dispose();

// 		// const user = await database.select('*').from('directus_users').where('id', data.$accountability.user);
// 		console.log('result', result);
// 		return result;
// 	},
// });
export default defineOperationApi<Options>({
	id: 'exec',
	handler: async ({ code }, { data, env, logger, database, services, accountability }) => {
		const func = eval(`(${code})`);
		const t = await func({ data, env, database, accountability, services, randUuid, axios, logger });
		// const churchId = await database.table('directus_roles').first('church_id').where('id', data.$accountability.role);
		return t;
	},
});
