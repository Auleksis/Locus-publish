/**
 * Author: Alexander Ganiev (Aulex)
 * Creation Date: 19.09.2023
 */

import '@styles/SearchPage.css';

import WorkFolderManager from "@src/storage/LocusWorkspace/WorkFolderManager";
import { WorkSpaceManager } from "@src/storage/LocusWorkspace/WorkSpaceManager";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


/**
 * 
 * @param currentWorkspace - is a present space from the page has been loaled 
 * @param loadedFiles - is an array of loaded files from the current workspace
 * @returns an HTML page for searching
 */
function SearchPage(){
    //VARS

    //MAIN FIELDS
    const { workspaceName } = useParams(); //Get workspaceName from URL

    const [workspace, setWorkSpace] = useState({});

    const [request, setRequest] = useState('');





    //FOR FUTURE
    
    // SET UP SEARCH OPTIONS LIKE SEARCH ENGINE, WHICH FILES TO SEARCH AND SO ON
    // const [searchOptions, setSearchOptions] = useState({});


    //SET UP HOW TO DISPLAY RESULT
    //INCLUDES OPTIONS FOR BOTH TEXT AND GRAPH MODES
    //const [displayOptions, setDisplayOptions] = useState({});




    //ADDITIONAL FIELDS

    //BUFFER FOR LOADED FILES FROM THE CHOSEN WORKSPACE
    const [filesBuffer, setFilesBuffer] = useState([]);

    //BUFFER FOR FOUND FILES BY A REQUEST 
    const [foundFiles, setFoundFiles] = useState([]);



    //------------------------------------------------------------------



    //LOGIC




    //LAOD WOKSPACE AND ITS FILES WHEN THE PAGE APPEARS
    useEffect(() => {
        const workFolderManager = WorkFolderManager.instance;

        const space = workFolderManager.getWorkSpace(workspaceName);

        setWorkSpace(space);

        const workspaceManager = new WorkSpaceManager();

        const loadFiles = async() => {
            await workspaceManager.setWorkspace(space);
            setFilesBuffer((prev) => [...workspaceManager.getAllFiles()]);
        };

        loadFiles();

        console.log(space);

    }, []);





    //HANDLE REQUESTS 
    useEffect(() => {

    }, [request]);




    //HANDLE SWITCHING WORKSPACES
    const switchWorkspace = () => {

    };




    //------------------------------------------------------------------

    //RENDER

    return(
        <div className="page-box">
            

            <div className='up-bar'>

            </div>


        </div>
    );
}

export default SearchPage;