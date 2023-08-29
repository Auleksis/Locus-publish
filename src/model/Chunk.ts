import LocusFile, { FileCore } from '@model/LocusFile';
export class Chunk{

    private _id : number;
    private _creation_date: Date;
    private _modif_date: Date;
    private _locusFile: LocusFile
    private _core: Core;
    
    constructor(id:number, file: LocusFile, creation_date: Date, modif_date: Date, start_pos: number, length: number)
    {
        this._id = id;
        this._creation_date = creation_date;
        this._modif_date = modif_date;
        this._locusFile = file
        this._core = new Core(file, start_pos, length);
    }

    public get id(){
        return this._id;
    }


    public get creationDate(){
        return this._creation_date;
    }

    public get modifDate(){
        return this._modif_date;
    }

    public get file(){
        return this._locusFile;
    }

    public get content(){
        return this._core.content
    }

    public equals(compareTo: Chunk){
        return this._id===compareTo.id && this.file.equals(compareTo.file)
    }

    /**
     *  Fetches this object from the repository and copies the properties
     * @returns A Promise<Chunk> object of refreshing the properties with refreshed chunk at the end of the chain.
     */
    public refresh() : Promise<Chunk>{
        return this.file.repository.getChunk(this.id).then((newVersion : Chunk)=>{
            this._locusFile = newVersion._locusFile
            this._core = newVersion._core
            this._creation_date = newVersion.creationDate
            this._modif_date = newVersion.modifDate
            return this
        })
    }
}

//Chunk core that contains all the info to retrieve content and cached content
export class Core{
    private _file: FileCore | LocusFile;
    private _start_pos: number;
    private _length: number;
    private _cached_content: string | undefined;

    constructor (file: FileCore | LocusFile, start_pos: number, length: number){
        this._file = file;
        this._start_pos = start_pos;
        this._length  = length;
    }

    public get file(){
        return this._file;
    }

    public get startPos(){
        return this._start_pos;
    }
    public get length(){
        return this._length;
    }

    public get content(){
        //Lazy content property initialization
        return this._cached_content ?? this.getContent()
    }

   private async getContent() {
        this._cached_content= await this._file.fileManager.read(this._file.path, this._length, this._start_pos, 'utf8');
        return this._cached_content;
    }


    public equals(compareTo : Core){
        return this._start_pos===compareTo.startPos && this._length===compareTo.length && this.file.path === compareTo.file.path;
    }


}