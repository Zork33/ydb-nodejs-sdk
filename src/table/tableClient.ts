import EventEmitter from "events";
import {SessionPool} from "./sessionPool";
import {Session} from "./session";
import {ITableClientSettings} from "./internal/ITableClientSettings";

export class TableClient extends EventEmitter {
    private pool: SessionPool;

    constructor(settings: ITableClientSettings) {
        super();
        this.pool = new SessionPool(settings);
    }

    public async withSession<T>(callback: (session: Session) => Promise<T>, timeout: number = 0): Promise<T> {
        return this.pool.withSession(callback, timeout);
    }

    public async withSessionRetry<T>(callback: (session: Session) => Promise<T>, timeout: number = 0, maxRetries = 10): Promise<T> {
        return this.pool.withSessionRetry(callback, timeout, maxRetries);
    }

    public async destroy() {
        await this.pool.destroy();
    }
}
