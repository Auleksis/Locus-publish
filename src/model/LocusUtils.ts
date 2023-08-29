import { Core } from '@model/Chunk';
import LocusFile, { FileCore } from '@model/LocusFile';

export class LocusUtils{


    /**
     * Number of symbols that are loaded and stored in each cycle of getCores() algorithm.
     * 
     * @remarks
     * it's 32KiB at most
     */
    private static loadSize: number = 8192;
    /**
     * Splits contents of the file into chunk cores.
     * 
     * @param file - The file to split into chunks.
     * 
     * @returns Promise of cores from the specified file.
     */
     public static async getCores(file: FileCore | LocusFile) : Promise<Core[]>{
        let currPos: number = 0;
        let loadPos: number = 0;
        let loadedText: string = '';
        const resultCores : Core[] = [];
        const fileStats: {size:number} = await file.fileManager.stat(file.path);
        const maxCycles = Math.ceil(fileStats.size/LocusUtils.loadSize);

        for(let i : number = 0; i <=maxCycles; i++){
            console.log(` NEW CYCLE I - ${i}`)
            let loadBuffer : string = await file.fileManager.read(file.path, LocusUtils.loadSize, loadPos, 'utf8'); //.read() doesn't throw an exception on reading empty file
            loadPos+=loadBuffer.length;
            //Wonder if this check actually affects perfomance
            if(loadedText === '') loadedText = loadBuffer;
            else loadedText += loadBuffer;
            
            
            let pars : string[] = loadedText.split(/(?<=\n)(?=.)/gm);

            while(pars.length > 1 || loadBuffer ===''){
                let paragraph : string = pars.shift() ?? '';
                if(paragraph.length <= 600){
                    if(paragraph.length >= 80){
                        console.log(`Got up to no problem with par ${paragraph.slice(0, 20)} |len ${paragraph.length}!!!`)
                        resultCores.push(new Core(file, currPos, paragraph.length))
                        currPos+=paragraph.length;  
                    }
                    else{
                        console.log(`Got up to small with par ${paragraph.slice(0, 20)} |len ${paragraph.length}!!!`)
                        if(pars.length==0 && loadBuffer === ''){
                            loadedText=paragraph
                            break;
                        }
                        else{
                            pars[0]=paragraph+pars[0];
                        }
                    }
                }
                else{
                    let sentences : string[] = paragraph.split(/(?<=\.)/gm);
                    let curLen : number = 0
                    console.log(`Got up to sentences with par ${paragraph.slice(0, 20)} |len ${paragraph.length}!!!`)
                    while(sentences.length > 0 && curLen+sentences[0].length <= 600){
                        curLen+=(sentences.shift() ?? '').length
                    }
                    if(curLen >= 80){
                        resultCores.push(new Core(file, currPos, curLen))
                        currPos+=curLen
                        pars.unshift(sentences.join(''))
                    }
                    else{
                        console.log(`Got up to words with par ${paragraph.slice(0, 20)} |len ${paragraph.length}!!!`)
                        let words : string[] = (sentences.shift() ?? '').split(/(?<=\s)/gm);
                        while(words.length > 0 && curLen+words[0].length <= 600){
                            curLen+=(words.shift() ?? '').length
                        }
                        if(curLen >= 80){
                            resultCores.push(new Core(file, currPos, curLen))
                            currPos+=curLen
                            pars.unshift(words.join('') + sentences.join(''))
                        }
                        else{
                            console.log(`Got up to letters with par ${paragraph.slice(0, 20)} |len ${paragraph.length}!!!`)
                            let word : string = (words.shift() ?? '');
                            const leftLen: number = 80 - curLen
                            resultCores.push(new Core(file, currPos, 80))
                            currPos+=80
                            pars.unshift(word.slice(leftLen) + words.join('') + sentences.join(''))
                        }


                    }
                }
            }

            if(loadBuffer==='')break;
            loadedText = pars.pop() ?? '';
            console.warn(loadedText)
        
        }
        if(loadedText.length != 0){
            resultCores.push(new Core(file, currPos, loadedText.length))
        }
        return resultCores;

    }


}