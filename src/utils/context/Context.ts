// // export defaultContext = new
//
// import Timeout = NodeJS.Timeout;
//
// // TODO: ??? Default logger
//
// export class Context {
//
//     constructor(logger?: any) {
//         if (logger) this.l = logger;
//     }
//
//     // TODO: Bring testable Logger.  Highlish %... capability
//     private l?: logger;
//     private c?: boolean;
//     /**
//      * If this is not a cancelable context, a Promise mock will be returned.
//      */
//     private p?: Promise;
//     private v?: Map;
//
//     /**
//      * It is strongly recommended to use ctx.logger instead of this.logger:
//      * - This ensures that a consistent logger is used during ctx lifetime.
//      * - In this form, the logger is available not only in class methods, but also in functions to where ctx is passed in.
//      */
//     get logger() {
//
//     }
//
//     cancel();
//
//     isCancelled();
//
//     get cancelPromise() {
//
//     }
//
//     get map() {
//         if
//     }
//
//     set(key: string | Symbol, value any);
//
//     get(key: string | Symbol);
//
//     cancelAfter(timeout: Timeout) {
//
//     }
//
//     // TODO: new conext, to start with
//     // TODO: attempt to get logger from 'this', when new conytext gets created
//     // TODO: fix context - positional args
//     // TODO: fix context - named args
//     // TODO: Logger
//     // TODO: Child context
//
//     // TODO: trace and span support - likely span wrapper
// }
