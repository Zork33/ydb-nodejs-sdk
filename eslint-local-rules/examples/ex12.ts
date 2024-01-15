import { ContextWithLogger } from '../../src/context-with-logger';
// /* eslint-disable */
/* eslint local-rules/context: "error" */

export const F = async () => {
    const ctx = ContextWithLogger.get('ydb-sdk:F', this);

    console.info(100);

    ctx.doSync(() => T());
};

export const T = () => { ContextWithLogger.get('ydb-sdk:T', this); };

export class C {
    public async M() {
        const ctx = ContextWithLogger.get('ydb-sdk:C.M', this);

        // /** */
        //
        // console.info(1000);

        ctx.doSync(() => F());

        // console.info(1000);
        // setTimeout(ctx.doHandleError(() => F()), 10);
    }

    private async Q() {
        const ctx = ContextWithLogger.get('ydb-sdk:C.Q', this);

        await ctx.do(() => F());
    }
}
