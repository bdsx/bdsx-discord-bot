
import * as fs from 'fs';
import * as path from 'path';

const projectPath = path.join(process.cwd(), process.argv[1]);
const stateFilePath = path.join(projectPath, 'state.json');

interface State {
    save():void;
}

function loadState():State {
    try {
        return JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
    } catch (err) {
        return {} as State;
    }
}

export const state = loadState();

let saving:Promise<void>|null = null;
let saveRequest = false;

Object.setPrototypeOf(state, {
    save():Promise<void> {
        saveRequest = true;
        if (saving !== null) return saving;
        return saving = (async()=>{
            while (saveRequest) {
                saveRequest = false;
                await fs.promises.writeFile(stateFilePath, JSON.stringify(state, null, 4));
            }
        })();
    },
});
