export enum SourceType{
    DB,
    LocusBox
}

export class RepositorySourceInfo {
    private _type : SourceType;
    private _name: string;
    private _id : number;
    
    constructor(type : SourceType, name : string, id: number){
        this._type = type;
        this._id = id;
        this._name=name;
    }

    public get type(){
        return this._type
    }
    public get name(){
        return this._name
    }
    public get id(){
        return this._id
    }


    public equals(compareTo: RepositorySourceInfo){
        return this._id === compareTo.id && this._type === compareTo._type
    }
}