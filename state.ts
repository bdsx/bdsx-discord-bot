
import * as fs from 'fs';

interface State {
    save():void;
}

function loadState():State {
    try {
        return JSON.parse(fs.readFileSync('./state.json', 'utf8'));
    } catch (err) {
        return {} as State;
    }
}

export const state = loadState();

let saving:Promise<void>|null = null;
let saveRequest = false;

Object.setPrototypeOf(state, {
    async save():Promise<void> {
        saveRequest = true;
        if (saving !== null) return saving;
        saving = (async()=>{
            while (saveRequest) {
                saveRequest = false;
                await fs.promises.writeFile('./state.json', JSON.stringify(state, null, 4));
            }
        })();
    },
});
