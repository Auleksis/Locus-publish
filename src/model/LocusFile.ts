import { ChunkRepository } from "@storage/ChunkRepository";
import { FileManager } from "@storage/FileManager";

export default class LocusFile{
    private _id : number;
    private _name: string | undefined;
    private _creation_date: Date;
    private _modif_date: Date;
    private _repository:  ChunkRepository
    private _fileCore: FileCore;
    
    constructor(id:number, fileCore:FileCore, creation_date: Date, modif_date: Date, repository: ChunkRepository)
    {
        this._id = id;
        this._fileCore = fileCore
        this._name = this._fileCore.path.split('/').pop()?.split('.')[0];
        this._creation_date = creation_date;
        this._modif_date = modif_date;
        this._repository = repository
       
    }

    public get id(){
        return this._id;
    }


    public get name(){
        return this._name;
    }

    public get creationDate(){
        return this._creation_date;
    }

    public get modifDate(){
        return this._modif_date;
    }

    public get path(){
        return this._fileCore.path;
    }

    public get repository(){
        return this._repository
    }

    public get fileManager(){
        return this._fileCore.fileManager
    }


    public equals(compareTo:LocusFile){
        return this.id === compareTo.id && this.path === compareTo.path;
    }

}

//File core represent physical side of the file (without repository metadata)
export class FileCore{
    private _path: string;
    private _fileManager : FileManager

    constructor(path: string, fileManager : FileManager){
        this._path = path
        this._fileManager = fileManager
    }
    
    public get path(){
        return this._path;
    }

    public get fileManager(){
        return this._fileManager;
    }




}