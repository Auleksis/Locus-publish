import { Chunk, Core } from "@model/Chunk";
import Cluster from "@model/Cluster";
import LocusFile from "@model/LocusFile";
import { RepositorySourceInfo } from "@storage/RepositorySourceInfo";


export interface ChunkRepository {


    sourceInfo: RepositorySourceInfo;

    /**
     * 
     */
    

    /**
     * Registers a file by specified path in the repository and separates it into chunks, storing them in that repository.
     * 
     * @param filePath - The path to a file to register
     * @returns An object containing the registered file, created chunks and the trivial cluster (a cluster containing chunks from the specified file)
     */
    registerFile(filePath: string): Promise<{ registetedFile: LocusFile, newCluster: Cluster, newChunks: Chunk[] }>;

    /**
     * Appends cores to the specified  locus file (making changes to the underlying physical file) and registers them.
     * 
     * @param file - The file to append cores to.
     * @param cores - The cores to append to the file.
     * @returns An object containing chunks with specified cores and created trivial cluster.
     */
    appendFile(file: LocusFile, cores: Core[]): Promise<{ newCluster: Cluster, newChunks: Chunk[] }>;


    /**
     * Ensures that specified file is not present in the repository along with the chunks connected to it.
     * 
     * @param file - The file to ensure not being present in the repository
     * 
     */
    removeFile(file: LocusFile): Promise<void>;

    /**
     * Ensures that chunks with provided IDs are not in the repository.
     * 
     * @remarks
     * This method doesn't remove the content of the file specified chunks represent.
     * 
     * @param id - The IDs of the chunk to remove.
     * @returns The number of removed chunks.
     */
    removeChunks(id: number[]): Promise<number>;

    /**
     * Return chunks connected to the specified Locus File.
     * 
     * 
     * @param file - The specified file to get chunks connected to.
     * @returns Chunks connected to the specified file.
     */
    getChunks(file: LocusFile): Promise<Chunk[]>;

    /**
    * Return chunks  contained in the  specified Cluster.
    * 
    * 
    * @param cluster - The specified cluster to get chunks connected to.
    * @returns Chunks contained in the specified cluster.
    */
    getChunks(cluster: Cluster): Promise<Chunk[]>;

    /**
    * Return clusters contained in the specified Cluster.
    * 
    * 
    * @param cluster - The specified cluster to get chunks connected to.
    * @returns Clusters contained in the specified cluster.
    */
    getClusters(cluster: Cluster): Promise<Cluster[]>;
    /**
     * Get chunk by its id.
     * 
     * 
     * @param id - The id of the chunk to  return
     * @returns Chunk with the specified id.
     */
    getChunk(id: number): Promise<Chunk>;

    /**
     * Get cluster by its id.
     * 
     * 
     * @param id - The id of the cluster to  return
     * @returns Cluster with the specified id.
     */
    getCluster(id: number): Promise<Cluster>;

    /**
     * Get locus file by its id.
     * 
     * 
     * @param id - The id of the file to  return
     * @returns Locus File with the specified id.
     */
    getFile(id: number): Promise<LocusFile>;

    /**
     * Ensures that provided chunks are linked to the specifed cluster.
     * 
     * 
     * @param cluster - The cluster to link chunks to.
     * @param chunks  - An array of chunks to link to the cluster.
     */
    linkToCluster(cluster: Cluster, chunks: Chunk[]): Promise<void>;

    /**
     * Ensures that provided clusters are linked to the specifed toCluster.
     * 
     * 
     * @param toCluster - The cluster to link specifed clusters to.
     * @param clusters  - An array of clusters to link to the toCluster.
     */
    linkToCluster(toCluster: Cluster, clusters: Cluster[]): Promise<void>;

    /**
     * Ensures that provided chunks are  not linked to the specifed cluster.
     * 
     * 
     * @param cluster - The cluster to unlink chunks from.
     * @param chunks  - An array of chunks to unlink from the cluster.
     */
    unlinkFromCluster(cluster: Cluster, chunks: Chunk[]): Promise<void>;

    /**
     * Ensures that provided clusters are  not linked to the specifed fromCluster.
     * 
     * 
     * @param fromCluster - The cluster to unlink specifed clusters from.
     * @param clusters  - An array of clusters to unlink from the fromCluster.
     */
    unlinkFromCluster(fromCluster: Cluster, clusters: Cluster[]): Promise<void>;
    /**
     * Returns all of the files registered in the repository.
     * 
     * @returns An array of files registered in the repository.
     * 
     */
    getAllFiles(): Promise<LocusFile[]>

    /**
     * Returns all of the chunks registered in the repository.
     * 
     * @returns An array of chunks registered in the repository.
     * 
     */
    getAllChunks(): Promise<Chunk[]>

    /**
     * Returns all of the clusters registered in the repository.
     * 
     * @returns An array of clusters registered in the repository.
     * 
     */
    getAllClusters(): Promise<Cluster[]>




}