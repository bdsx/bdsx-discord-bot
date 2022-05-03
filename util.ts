
export function emptyFunc():void {}
export const abandonPromise = new Promise<never>(emptyFunc);
