import { TauriFileManager } from "@src/storage/TauriFileManager";


export class WorkSpaceFile {
    private _id: number;
    private _title: string;
    private _path: string;

    constructor(id: number, title: string, path: string) {
        this._id = id;
        this._title = title;
        this._path = path;
    }

    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
    }

    public get path(): string {
        return this._path;
    }

    public set path(value: string) {
        this._path = value;
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    /**
     * This method simplifies receiving file content avoiding using TauriFileManager directly
     * @returns only file text content in utf-8 encoding
     */
    public async getFileContents(): Promise<string> {
        console.log("WorkSpaceFile::getFileContents() has been called");

        const fileManager = new TauriFileManager();

        const contents = await fileManager.readAll(this._path, 'utf-8');

        console.log(`Read contents:`);
        console.log(contents);

        return contents;
    }
}
