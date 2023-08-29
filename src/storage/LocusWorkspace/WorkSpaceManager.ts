import WorkSpace from "./WorkSpace";
import { WorkSpaceIndex } from "./WorkSpaceIndex";
import { WorkSpaceFile } from "./WorkSpaceFile";
import { WorkSpaceCore } from "./WorkSpaceCore";


export class WorkSpaceManager {
    private static _instance: WorkSpaceManager;

    private _current_workspace?: WorkSpace;

    private _current_core?: WorkSpaceCore | undefined;

    private _index?: WorkSpaceIndex;

    constructor() {
        if (WorkSpaceManager._instance) {
            return WorkSpaceManager._instance;
        }

        WorkSpaceManager._instance = this;
    }

    public async setWorkspace(workspace: WorkSpace) {
        console.log("WorkSpaceManager::setWorkspace() has been called");

        this._current_workspace = workspace;

        this._current_core = await this._current_workspace.getCore();

        this._index = new WorkSpaceIndex();

        for (let i = 0; i < this._current_core.includedFiles.length; i++) {
            const file = this._current_core.includedFiles[i];

            const content = await file.getFileContents();

            this._index.addData({id: file.id, title: file.title, content: content});
        }

        console.log(`Received workspace:\n`);
        console.log(this._current_workspace);

        console.log(`Loaded core:`);
        console.log(this.current_core);

        console.log(`Initialized index:`);
        console.log(this._index);
    }

    public async saveWorkSpaceCore() {
        if (this._current_core && this._current_workspace) {
            this._current_workspace?.save(this._current_core);
        }
    }

    public search(request: string): WorkSpaceFile[] {
        console.log("WorkSpaceManager::search() has been called");

        const ids = this._index?.search(request);

        let files: WorkSpaceFile[] = [];

        ids?.forEach((value) => {
            const file = this._current_core?.getFile(value as number);
            if (file) {
                files.push(file);
            }
        });

        console.log(`Found files:`);
        console.log(files);

        return files;
    }

    /**
     * It's better to use this function instead of WorkSpaceCore::addFile
     * @param filePath - path to the file
     * @returns a promise. If it's successful, then it returns a new WorkSpaceFile which is added to WorkSpaceCore
     */
    public async addFile(filePath: string): Promise<WorkSpaceFile | undefined> {
        console.log("WorkSpaceManager::addFileToCore() has been called");

        if (this._current_workspace && this._current_core && this._index) {
            const file = await this._current_core?.addFile(filePath, this._current_workspace);

            if (file) {
                // const id = this._current_core.getID(file?.title);
                const content = await file.getFileContents();
                this._index.addData({id: file.id, title: file.title, content: content});
            }

            console.log(`Added file:`);
            console.log(file);

            return file;
        }

        console.log('Nothing was added');

        return undefined;
    }

    public async removeFile(fileID: number): Promise<WorkSpaceFile | undefined> {
        console.log("WorkSpaceManager::removeFile() has been called");

        if (this._current_core) {
            //const id = this._current_core.getID(fileTitle);
            this._index?.removeData(fileID);
            const file = this._current_core.getFile(fileID);

            await this._current_core.removeFile(fileID);

            console.log(`Removed file:`);
            console.log(file);

            return file;
        }

        console.log('Nothing was removed');

        return undefined;
    }

    public getFile(fileID: number): WorkSpaceFile | undefined{
        console.log("WorkSpaceManager::getFile() has been called");
        
        const file = this._current_core?.getFile(fileID);

        console.log(`Got file:`);
        console.log(file);

        return file;
    }

    public get current_core(): WorkSpaceCore | undefined {
        return this._current_core;
    }

    public set current_core(value: WorkSpaceCore | undefined) {
        this._current_core = value;
    }
}
