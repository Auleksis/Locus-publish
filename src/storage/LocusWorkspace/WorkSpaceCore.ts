import { TauriFileManager } from "@src/storage/TauriFileManager";
import { path } from "@tauri-apps/api";
import WorkSpace from "./WorkSpace";
import { WorkSpaceFile } from "./WorkSpaceFile";


export class WorkSpaceCore {
    private _name: string;

    private _includedFiles: WorkSpaceFile[];

    private _lastUsedFileID: number;

    private _freeFileIDs: number[];

    constructor(name: string) {
        this._name = name;
        this._includedFiles = [];
        this._lastUsedFileID = 0;
        this._freeFileIDs = [];
    }

    public async addFile(filePath: string, workspace: WorkSpace): Promise<WorkSpaceFile | undefined> {
        console.log("WorkSpaceCore::addFile() has been called");

        const pathParts = filePath.split(path.sep);
        const title = pathParts[pathParts.length - 1];

        const copiedFilePath = await workspace.getWorkSpaceFilePath(title);

        const fileID = this._freeFileIDs.length > 0 ? (this._freeFileIDs.pop() as number) : ++this._lastUsedFileID;

        const file = new WorkSpaceFile(fileID, title, copiedFilePath);

        if (this._includedFiles.includes(file)) {
            return undefined;
        }

        const fileManager = new TauriFileManager();

        await fileManager.copyFile(filePath, copiedFilePath);

        this._includedFiles.splice(fileID, 0, file);

        console.log(`Added file:`);
        console.log(file);

        return file;
    }

    /**
     *
     * @param fileID represents the actual file index in the core array
     */
    public async removeFile(fileID: number) {
        console.log("WorkSpaceCore::removeFile() has been called");

        const thisFile = (item: WorkSpaceFile) => item.id == fileID;
        const index = this._includedFiles.findIndex(thisFile);

        //ЕСЛИ ФАЙЛЫ СМЕЩАЮТСЯ, ТО ОНИ ТЕРЯЮТ ПРАВИЛО ID = INDEX IN ARRAY
        this._freeFileIDs.push(fileID);

        const file = this._includedFiles[index];

        const fileManager = new TauriFileManager();

        await fileManager.removeFile(file.path);

        this._includedFiles.splice(index, 1);

        console.log(`Removed file:`);
        console.log(file);
    }

    public getFile(fileID: number): WorkSpaceFile | undefined {
        console.log("WorkSpaceCore::getFile() has been called");

        const thisFile = (item: WorkSpaceFile) => item.id === fileID;
        const index = this._includedFiles.findIndex(thisFile);

        const file = this._includedFiles[index];

        console.log(`Got file:`);
        console.log(file);

        return file;
    }

    public getArrayIDByTitle(fileTitle: string): number {
        console.log("WorkSpaceCore::getArrayIDByTitle() has been called");

        const thisFile = (item: WorkSpaceFile) => item.title === fileTitle;
        const index = this._includedFiles.findIndex(thisFile);

        console.log(`Array index:`);
        console.log(index);

        return index;
    }

    public getByArrayID(fileID: number): number {
        console.log("WorkSpaceCore::getArrayIDByTitle() has been called");

        const thisFile = (item: WorkSpaceFile) => item.id === fileID;
        const index = this._includedFiles.findIndex(thisFile);

        console.log(`Array index:`);
        console.log(index);

        return index;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get includedFiles(): WorkSpaceFile[] {
        return this._includedFiles;
    }

    public set includedFiles(value: WorkSpaceFile[]) {
        this._includedFiles = value;
    }

    public get lastUsedFileID(): number {
        return this._lastUsedFileID;
    }
    public set lastUsedFileID(value: number) {
        this._lastUsedFileID = value;
    }

    public get freeFileIDs(): number[] {
        return this._freeFileIDs;
    }
    public set freeFileIDs(value: number[]) {
        this._freeFileIDs = value;
    }
}
