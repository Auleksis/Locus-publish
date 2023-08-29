import WorkSpace from "@src/storage/LocusWorkspace/WorkSpace";
import { WorkSpaceCore } from "./WorkSpaceCore";
import { TauriFileManager } from "../TauriFileManager";
import { join } from "@tauri-apps/api/path";

export default class WorkFolderManager{
    //Class
    private static _defaultSpacesFolder: string;
    private static _fileManager: TauriFileManager;
    private static _config_filename: string = "all_spaces_config.json";

    //Object
    private static _instance: WorkFolderManager;
    private _workspaces: WorkSpace[] = [];

    
    constructor(){
        if(WorkFolderManager._instance){
            return WorkFolderManager._instance;
        }
        
        this._workspaces = [];

        WorkFolderManager._instance = this;
    }
    
    public static initialize(defaultSpacesFolder: string){
        console.log("WorkFolderManager::initialize() has been called");

        this._defaultSpacesFolder = defaultSpacesFolder;
        this._fileManager = new TauriFileManager();

        new WorkFolderManager();
    }

    /**
     * This function creates a default folder where all notes will be stored
     * Additionally it initializes an instance of the AllWorkSpacesManager class if the default folder exists
     * @returns true if the folder is created or false if it exists
     */
    public static async createDefaultFolder() : Promise<boolean>{
        console.log("WorkFolderManager::createDefaultFolder() has been called");

        const result = await this._fileManager.creareDir(this._defaultSpacesFolder);

        // if(result === false){
        //     await this.load();
        // }

        return result;
    }


    public static async load(): Promise<WorkFolderManager>{
        console.log(`WorkFolderManager::load() has been called`);

        const allSpaceConfigJSONPath = await join(this._defaultSpacesFolder, this._config_filename);

        const jsonContent = await this._fileManager.readAll(allSpaceConfigJSONPath, 'utf-8');

        let spaceArray: {_name: string, _folderPath: string}[] = [];

        spaceArray = JSON.parse(jsonContent);

        WorkFolderManager._instance = new WorkFolderManager();

        spaceArray.forEach((element) => {
            const space = new WorkSpace(element._folderPath, element._name);
            WorkFolderManager._instance._workspaces.push(space);
        });

        console.log(`An instance has been loaded:`);
        console.log(this._instance);

        return WorkFolderManager._instance;
    }

    public async save(): Promise<boolean>{
        console.log("WorkFolderManager::save() has been called");

        const jsonObject = JSON.stringify(this._workspaces);
        
        const allSpacesJSONfile = await join(WorkFolderManager._defaultSpacesFolder, WorkFolderManager._config_filename);


        return WorkFolderManager._fileManager.createFile(allSpacesJSONfile, jsonObject, true);
    }

    public async createWorkSpace(name: string): Promise<WorkSpace | undefined>{
        console.log("WorkFolderManager::createWorkSpace() has been called");

        const spaceDir: string = await join(WorkFolderManager._defaultSpacesFolder, name);

        await WorkFolderManager._fileManager.creareDir(spaceDir);

        const workspace = new WorkSpace(spaceDir, name);

        await workspace.initCore();

        this._workspaces.push(workspace);

        console.log(`A workspace has been created:`);
        console.log(workspace);

        return workspace;
    }

    public getWorkSpace(workspaceName: string): WorkSpace | undefined{
        console.log("WorkFolderManager::getWorkSpace() has been called");

        const workspace = this._workspaces.find(e => e.name == workspaceName);

        console.log(`A workspace has been found:`);
        console.log(workspace);

        return workspace;
    }

    public static get instance(){
        console.log("WorkFolderManager::instance() has been called");
        return this._instance;
    }
}