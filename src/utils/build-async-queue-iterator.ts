/**
 * Turns the data stream into async iterator (Symbol.[asyncIterator], for await (...)) form.
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
export interface IAsyncQueueIterator<T> {
    push(value: T): void;
    end(err?: Error): void;
    [Symbol.asyncIterator](): AsyncGenerator<T, void>;
}

const QUEUE_END = Symbol('QUEUE_END');

export function buildAsyncQueueIterator<T>(): IAsyncQueueIterator<T> {

    let waitNextItemPromiseResolve: ((value: T | Symbol) => void) | undefined;
    let waitNextItemPromiseReject: ((err: Error) => void) | undefined;

    const queue: T[] = [];
    let isQueueOver: boolean | undefined;
    let error: Error | undefined;

    return {
        push(value: T): void {
            if (isQueueOver) throw new Error('The queue has already been closed by calling end()');
            if (waitNextItemPromiseResolve) {
                waitNextItemPromiseResolve(value);
                waitNextItemPromiseResolve = waitNextItemPromiseReject = undefined;
            } else {
                queue.push(value);
            }
        },

        end(err?: Error): void {
            if (isQueueOver) throw new Error('The queue has already been closed by calling end()');
            isQueueOver = true;
            error = err;
            if (err) {
                if (waitNextItemPromiseReject) waitNextItemPromiseReject(err);
            } else {
                if (waitNextItemPromiseResolve) waitNextItemPromiseResolve(QUEUE_END);
            }
        },

        async *[Symbol.asyncIterator](): AsyncGenerator<T, void>  {
            while (true) {
                if (queue.length > 0) {
                    if (error) throw error;
                    console.info(1000);
                    yield queue.shift() as T;
                } else if (isQueueOver) {
                    console.info(1001);
                    return;
                } else {
                    const waitNextItemPromise = new Promise<T | Symbol>((resolve, reject) => {
                        waitNextItemPromiseResolve = resolve;
                        waitNextItemPromiseReject = reject;
                    });
                    const value: T | Symbol = await waitNextItemPromise;
                    if (value === QUEUE_END) {
                        console.info(1002);
                        return;
                    }
                    console.info(1003);
                    yield value as T;
                }
            }
        },
    };
}
