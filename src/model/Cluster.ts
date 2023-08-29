import {Chunk} from '@model/Chunk'
import { ChunkRepository } from '@storage/ChunkRepository';


export default class Cluster{
    private _id : number;
    private _name: string | undefined;
    private _creation_date: Date;
    private _modif_date: Date;
    private _isCaching : Boolean;
    private _containedChunks?: Chunk[];
    private _containedClusters?: Cluster[];
    private _repository: ChunkRepository

    constructor(id:number, name:string, creation_date: Date, modif_date:Date, repository: ChunkRepository, isCaching:Boolean = false)
    {
        this._id = id;
        this._name = name
        this._creation_date = creation_date
        this._modif_date = modif_date
        this._repository = repository
        this._isCaching = isCaching
       
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

    public containedChunks() : Promise<Chunk[]>{
        if(this._isCaching){
            return this.containedChunks===undefined ? this.getChunks() : new Promise(()=>this._containedChunks)
        }
        return this.getChunks()
    }

    private getChunks() : Promise<Chunk[]>{
        const chunkPromise = new Promise<Chunk[]>(()=>this._repository.getChunks(this))
        if(this._isCaching){
            chunkPromise.then((value)=>this._containedChunks=value)
        }
        return chunkPromise;

    }

    public containedClusters() : Promise<Cluster[]>{
        if(this._isCaching){
            return this._containedClusters === undefined ? this.getClusters() : new Promise(()=>this._containedClusters)
        }
        return this.getClusters()
    }

    private getClusters() : Promise<Cluster[]>{
        const clusterPromise = new Promise<Cluster[]>(()=>this._repository.getClusters(this))
        if(this._isCaching){
            clusterPromise.then((value)=>this._containedClusters=value)
        }
        return clusterPromise;

    }

    public refresh() : Promise<Cluster>{
        const refreshPromise = this._repository.getCluster(this.id).then((newVersion : Cluster)=>{
            this._name = newVersion.name
            this._creation_date = newVersion.creationDate
            this._modif_date = newVersion.modifDate
            return this
        })
        if(this._isCaching){
            refreshPromise.then(this.getClusters)
            refreshPromise.then(this.getChunks)
        }
        return refreshPromise
    }

}