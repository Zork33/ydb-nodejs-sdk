/**
 * Turns the data stream into [asyncIterator] (for await (...)) form.
 *
 * Supports both scenarios:
 * - when data is coming in faster than it is being taken out
 * - and vice versa.
 *
 * Terminates the iterator when the stream is over.
 *
 * Terminates the iterator at any element with error, if an error is received from the stream
 *
 * *Limitations:*
 * - No restrictions on data buffering
 * - No up stream control to slow down data transfer from the sending side when buffers are full
 * - No size and latency statistics are collected
 */
export function asyncQueueIterator<T, QueueItem extends {value?: T, done: boolean}>() {

    let pendingPromise: Promise<QueueItem> | undefined;
    let pendingPromiseResolve: ((item: QueueItem) => void) | undefined;
    let pendingPromiseReject: ((err: Error) => void) | undefined;

    let cancelReject: (err: Error) => void;

    const cancelPromise = new Promise((_, reject) => {
        cancelReject = reject;
    });

    let isEnd: boolean | undefined;

    const queue: Promise<QueueItem>[] = [];

    return {
        push(value: T): void {
            const item = {value, done: false} as QueueItem;
            if (pendingPromiseResolve) {
                pendingPromiseResolve(item);
                pendingPromise = pendingPromiseResolve = pendingPromiseReject = undefined;
            } else {
                queue.push(Promise.resolve(item));
            }
        },

        end(err?: Error) {
            isEnd = true;
            if (err) {
                cancelReject(err);
                pendingPromiseReject?(err);
            } else {
                pendingPromiseResolve?({done: true});
            }
        },

        *[Symbol.asyncIterator]() {
            if (queue.length > 0) {
                yield Promise.race([cancelPromise, queue.unshift()]);
            } if (isEnd) {
                return;
            } else {
                pendingPromise = new Promise<QueueItem>((resolve, reject) => {
                   pendingPromiseResolve = resolve;
                   pendingPromiseReject = reject;
                });
                yield Promise.race([cancelPromise, pendingPromise]);
                if (pendingPromise !== undefined) throw new Error('Сannot continue iterating without waiting for the following value');
            }
        },
    };
}
