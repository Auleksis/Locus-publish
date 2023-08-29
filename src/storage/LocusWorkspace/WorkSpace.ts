import { FileManager } from "@src/storage/FileManager";
import { TauriFileManager } from "@src/storage/TauriFileManager";
import { join } from "@tauri-apps/api/path";
import FlexSearch from "flexsearch";
import { WorkSpaceCore } from "./WorkSpaceCore";
import { WorkSpaceFile } from "./WorkSpaceFile";


export default class WorkSpace{
    private _name: string;
    private _folderPath: string;

    private static _config_filename: string = 'space_config.json';

    constructor(folderPath: string, name: string){
        this._folderPath = folderPath;
        this._name = name;
    }

    /**
     * This function is used only for creation a new workspace.
     * It creates a config file.
     * @param name - name of the workspace name
     * @returns a WorkSpaceCore of the just created workspace
     */
    public async initCore(): Promise<WorkSpaceCore>{
        console.log("WorkSpace::initCore() has been called");

        const fileManager = new TauriFileManager();

        const spaceConfigFilePath = await join(this._folderPath, WorkSpace._config_filename);

        const spaceCore = new WorkSpaceCore(this._name);

        const spaceToJSON = JSON.stringify(spaceCore);

        await fileManager.createFile(spaceConfigFilePath, spaceToJSON, true);

        console.log("Created core:");
        console.log(spaceCore);

        return spaceCore;
    }

    public async getCore(): Promise<WorkSpaceCore>{
        console.log("WorkSpace::initCore() has been called");

        const fileManager = new TauriFileManager();

        const allSpaceConfigJSONPath = await join(this.folderPath, WorkSpace._config_filename);

        const jsonContent = await fileManager.readAll(allSpaceConfigJSONPath, 'utf-8');

        let coreArray: {_name: string, _includedFiles: {_id: number, _title: string, _path: string}[], _lastUsedFileID: number, _freeFileIDs: number[]};

        coreArray = JSON.parse(jsonContent);

        let core: WorkSpaceCore = new WorkSpaceCore(' ');

        core.name = coreArray._name;
        core.lastUsedFileID = coreArray._lastUsedFileID;
        core.freeFileIDs = coreArray._freeFileIDs;
        coreArray._includedFiles.forEach((file)=>{
            core.includedFiles.push(new WorkSpaceFile(file._id, file._title, file._path));
        })

        console.log("Loaded core:");
        console.log(core);

        return core;
    }

    public async save(core: WorkSpaceCore): Promise<boolean>{
        console.log("WorkSpace::save() has been called");

        const fileManager = new TauriFileManager();

        const spaceConfigFilePath = await join(this._folderPath, WorkSpace._config_filename);

        const spaceToJSON = JSON.stringify(core);

        await fileManager.createFile(spaceConfigFilePath, spaceToJSON, true);

        return true;
    }

    public getWorkSpaceFilePath(title: string): Promise<string>{
        console.log("WorkSpace::getWorkSpaceFilePath() has been called");
        
        return join(this.folderPath, title);
    }

    public get folderPath(): string {
        return this._folderPath;
    }

    public set folderPath(value: string) {
        this._folderPath = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }
}