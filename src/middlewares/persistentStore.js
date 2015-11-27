import { applyMiddleware } from 'redux';

// Constants
const FEED_CHANGED = '@@persistentStore/feedChanged';
const REDUX_ACTION_TYPE = 'reduxAction';
const WHITELISTED_DOMAINS = ['@@reduxReactRouter'];
const DESIGN_DOC = {
	_id: '_design/fetchReduxActionHistory',
	views: {
		fetchReduxActionHistory: {
			map: `function mapFun(doc) {
				if (doc.type === "${REDUX_ACTION_TYPE}") {
					emit(doc.id);
				}
			}`
		}
	}
};

// Functions
function dispatchSavedActionToStore(store, init, record) {
	store.dispatch({
		type: FEED_CHANGED,
		init: init,
		payload: record.doc.payload
	});
}

function persistenceMiddleware(db, options) {
	const whitelistedDomains = new Set();

	let { startingSequence, allowActions } = options;
	var sequence = startingSequence;

	(allowActions || WHITELISTED_DOMAINS).forEach(
		whitelistedDomains.add.bind(whitelistedDomains)
	);

	return (/* store */) => next => {
		var whiteListedActionQueue = [], waitingOnAsyncActions = 0;

		return action => {
			if (action.type === FEED_CHANGED) {
				next(action.payload);
				if (waitingOnAsyncActions === 1 && whiteListedActionQueue) {
					let queue = whiteListedActionQueue.slice();
					queue.forEach(next);
					whiteListedActionQueue = whiteListedActionQueue.splice(0, queue.length);
				}
				if (!action.init) {
					waitingOnAsyncActions--;
				}
			} else if (whitelistedDomains.has(action.type.split('/')[0])) {
				if (waitingOnAsyncActions) {
					whiteListedActionQueue.push(action);
				} else {
					next(action);
				}
				return;
			} else {
				sequence++;
				waitingOnAsyncActions++;
				db.put({
					_id: `RA-${sequence}`,
					type: REDUX_ACTION_TYPE,
					payload: action
				});
			}
		};
	};
}

export default function persistentStore({db}) {
	var middleware, savedActions = [];

	const createStoreWrapper = (createStore) => (reducer, initialState={}) => {
		let store = applyMiddleware(middleware)(createStore)(reducer, initialState);
		savedActions.forEach(dispatchSavedActionToStore.bind(null, store, true));

		db.changes({
			live: true,
			include_docs: true,
			since: 'now'
		}).on('change', dispatchSavedActionToStore.bind(null, store, false));

		return store;
	};

	return db.info().then((info) => {
		let { update_seq } = info;
		middleware = persistenceMiddleware(db, {startingSequence: update_seq});
		return db.put(DESIGN_DOC);
	}).catch((err) => {
		if (err.status !== 409) { throw err; }
		// ignore if doc already exists
	}).then(() => {
		return db.query('fetchReduxActionHistory', {include_docs: true});
	}).then((result) => {
		console.info(`Found ${result.total_rows} saved action(s).`);
		savedActions = result.rows;
		return createStoreWrapper;
	}).catch((err) => {
		if (err.message === 'missing') {
			console.info('Could not find saved state.');
			return createStoreWrapper;
		}
		console.error(err);
	});
}
