

class FilterTree {
    private readonly map = new Map<number, FilterTree>();

    constructor(public terminal:boolean) {
    }

    insert(message:string, offset:number):void {
        const chr1 = message.charCodeAt(offset++);
        let chr2 = message.charCodeAt(offset++);
        if (isNaN(chr2)) chr2 = 0;
        const key = (chr1 << 16) | chr2;

        const terminal = offset >= message.length;
        let next = this.map.get(key);
        if (next == null) this.map.set(key, next = new FilterTree(terminal));
        if (terminal) {
            next.terminal = true;
        } else {
            next.insert(message, offset);
        }
    }

    // check(message:string[], arrayIndex:number, stringIndex:number):boolean {
    //     let terminal = false;
    //     function read():number {
    //         const word = message[arrayIndex];
    //         const chr = word.charCodeAt(stringIndex);
    //         stringIndex++;
    //         if (stringIndex >= word.length) {
    //             stringIndex = 0;
    //             arrayIndex++;
    //             if (arrayIndex >= message.length) {
    //                 terminal = true;
    //             }
    //         }
    //         return chr;
    //     }

    //     const chr1 = message.charCodeAt(offset++);
    //     let chr2 = message.charCodeAt(offset++);
    //     if (isNaN(chr2)) chr2 = 0;
    //     const key = (chr1 << 16) | chr2;

    //     const list = this.map.get(key);
    //     if (list === null) {
    //         return false;
    //     }

    //     list?.terminal
    // }
}

// function checkFilter(message:string):boolean {
//     const replaced = message.split(/[~!@#$%^&*()_+\-=[\]{};':",./<>?`~\\| ]+/g);

//     for (const chr of replaced) {

//     }
// }
