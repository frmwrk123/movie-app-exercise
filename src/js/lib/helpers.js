const subscriptions = {}

export const processPromiseOrStream = (promiseOrStream, callback, args) => {
  let unsubscribe = true;
  if (promiseOrStream.length) {
    unsubscribe = !!promiseOrStream[0];
    promiseOrStream = promiseOrStream[1];
  }
  if (unsubscribe && subscriptions.subs) {
    subscriptions.subs.forEach(sub => sub.unsubscribe());
    delete subscriptions.subs;
  }
  if (promiseOrStream && promiseOrStream.subscribe) {
    subscriptions.subs = subscriptions.subs || [];
    subscriptions.subs.push(promiseOrStream.subscribe(callback));
  } else if (promiseOrStream && promiseOrStream.then) {
    promiseOrStream.then(callback);
  } else {
    if (args) {
      callback(args);
    } else {
      callback();
    }
  }
}
