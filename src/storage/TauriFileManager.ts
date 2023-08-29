import { FileManager } from "@storage/FileManager";

import { invoke } from "@tauri-apps/api";
import { resolve } from "@tauri-apps/api/path";

export class TauriFileManager implements FileManager{
    public read(path: string, length: number, startPos: number, encoding: string): Promise<string> {

        const readPromise = new Promise<string>((resolve, reject)=> {
            try{
                if(length < 0 || startPos < 0){
                    console.log("Invalid length or startPos");
                    resolve("");
                }
                resolve(invoke("read_file", {path: path, length: length, startPos: startPos, encoding: encoding}));
            }catch(error){
                let e: string = "Could't read the file: " + error;
                reject(e);
            }
        });

        return readPromise;
    }

    public stat(path: string): Promise<{ size: number; }> {
        const readPromise = new Promise<{size: number}>((resolve, reject)=> {
            resolve(invoke("file_stat", {path: path}).then((value: any) => {
                return {size: value.size};
            }));
            reject("Coudn't read file stats");
        });

        return readPromise;
    }
    
    public exists(path: string): Promise<boolean> {
        const existPromise = new Promise<boolean>((resolve, reject) => {
           resolve(invoke("try_file_exists", {path: path})); 
        });

        return existPromise;
    }

    public readAll(path: string, encoding: string): Promise<string> { 
        const readPromise = new Promise<string>((resolve, reject)=> {
            resolve(invoke("read_all_file", {path: path, encoding: encoding}));
            reject("Coudn't read the entire file");
        });

        return readPromise;
    }

    public async creareDir(path: string): Promise<boolean> {
        const folderExists = await this.exists(path);

        if(folderExists){
            return false;
        }

        invoke("create_folder", {path: path});

        return true;
    }

    public async copyFile(from: string, to: string): Promise<boolean> {
        const fromExists = await this.exists(from);

        if(!fromExists){
            return false;
        }

        const result: boolean = await invoke('copy_file_to', {filePath: from, toPath: to});

        return result;
    }

    public async createFile(path: string, contents: string, overwrite: boolean): Promise<boolean> {
        const result: boolean = await invoke('create_file', {path: path, contents: contents, overwrite: overwrite});
        return result;
    }

    public async removeFile(path: string): Promise<boolean> {
        const exists = await this.exists(path);

        if(!exists){
            return false;
        }

        const result: boolean = await invoke('remove_file', {path: path});
        return result;
    }

    public hello() {
        invoke("hello");
    }
}