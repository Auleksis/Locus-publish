import { Document } from "flexsearch";


export class WorkSpaceIndex {
    private static _instance: WorkSpaceIndex;
    // private static _option = {
    //     charset: "latin:extra",
    //     encode: false,
    //     split: /\s+/,
    //     tokenize: 'forward',
    //     cache: 20, //Must be learnt
    //     depth: 2,
    //     bidirectional: 1, 
    //     resolution: 9,
    //     minlength: 3,
    //     context: 'Context'
    // }
    private static _option = {
        charset: "latin:extra",
        preset: 'match'
    };

    private _index: Document<unknown, false>;

    private _idCounter: number;

    constructor() {
        // this._index = new Index({
        //     charset: "latin:extra",
        //     encode: false,
        //     tokenize: 'forward',
        //     cache: 20, //Must be learnt
        //     resolution: 9,
        // });
        // this._index = new Index({
        //     charset: "latin:extra",
        //     preset: 'score'
        // });

        this._index = new Document({
            document:{
                id: "id",
                index: ["title", "content"]
            }
        });

        this._idCounter = 0;

        if (WorkSpaceIndex._instance) {
            return WorkSpaceIndex._instance;
        }

        WorkSpaceIndex._instance = this;
    }

    public addData(document: {id: number, title: string, content: string}) {
        console.log("WorkSpaceIndex::addData() has been called");

        console.log(`Added document:`);
        console.log(document);

        this._index.add(document);
        this._idCounter++;
    }


    /**
     *
     * @param request - a string you are going to find
     * @param count - how much ids this function will return. By default this value equals to 0 that means you are going to get all results
     * @returns id of all matching.
     */
    public search(request: string, count: number = 0) {
        console.log("WorkSpaceIndex::search() has been called");

        console.log(`Requested:\n${request}\nIn count of: ${count == 0 ? 'all' : count}`);

        let result;

        if (count == 0) {
            result = this._index.search(request).map((e) => e.result).flat();
        }
        else{
            result = this._index.search(request, count).map((e) => e.result).flat();
        }

        console.log(`Found:`);
        console.log(result);

        return result;
    }

    public removeData(id: number) {
        console.log("WorkSpaceIndex::removeData() has been called");
        console.log(`Removed document with id:\n${id}`);
        this._index.remove(id);
    }
}
