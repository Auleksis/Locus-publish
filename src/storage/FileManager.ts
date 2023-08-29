
export abstract class FileManager{

    /**
     * Waky version of Singleton, where each time a new object is created with "new FileManager()"
     * the very first object is being returned every time.
     */
    constructor(){
        if(FileManager._instance){
            return FileManager._instance
        }
        FileManager._instance = this
    }

    private static _instance: FileManager;

    public static get instance() : FileManager{
        return this.instance
    }

    /**
     * Reads file in specified encoding.
     * @remarks
     * Must return blank string and not an error if the frame specified by startPos and length is
     * either not valid or extends out of the substring.
     * 
     * @param path - The path of the specified file
     * @param length - The length of the substring to read.
     * @param startPos - The starting position of the substring to read.
     * @param encoding - The encoding to read the substring in.
     */
    public abstract read(path:string, length:number, startPos: number, encoding:string):Promise<string>;

    /**
     * Returns metadata of the specified file.
     * @remarks
     * The return object will be changed eventually!
     * 
     * @param path - The path of the specified file
     * @returns Object containing size of the file in CHARACTERS.
     */
    public abstract stat(path:string):Promise<{size:number}>;

    /**
     * Returns true if the file with specified path exists.
     */
    public abstract exists(path:string):Promise<boolean>;

    /**
     * Returns all the content of the specified file
     * @param path - The path of the specified file
     * @param encoding - the encoding to read the content in
     */
    public abstract readAll(path: string, encoding: string): Promise<string>;

    public abstract creareDir(path: string): Promise<boolean>;

    public abstract copyFile(from: string, to: string): Promise<boolean>;

    public abstract createFile(path: string, contents: string, overwrite: boolean): Promise<boolean>;

    public abstract removeFile(path: string): Promise<boolean>;

    public abstract hello(): void;
}