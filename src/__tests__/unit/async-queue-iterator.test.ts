import {buildAsyncQueueIterator, IAsyncQueueIterator} from '../../utils/build-async-queue-iterator';

describe('asyncQueueIterator', () => {

    let q: IAsyncQueueIterator<number>;

    beforeEach(() => {
        q = buildAsyncQueueIterator<number>();
    });

    it('push first then dequeue', async () => {

        for (let n = 0; n < 4; n++) q.push(n);
        q.end();

        const arr = [];
        for await (const v of q) arr.push(v);

        expect(arr).toEqual([0, 1, 2, 3]);
    });

    // read faster
    // error when queue
    // errors
});
