// /* eslint-disable */
/* eslint local-rules/context: "error" */

function Retriable() {

}

@Retriable
export class C {
    @Retriable
    public async M() {
        const ctx = ContextWithLogger.getSafe('ydb-sdk:C.M', this);

        // /** */
        //
        // console.info(1000);

        // console.info(1000);
        // setTimeout(ctx.doHandleError(() => F()), 10);
    }
}
