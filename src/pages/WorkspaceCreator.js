import '@src/App.css';
import {ReactComponent as Plus} from '../Resources/plus.svg'
import {ReactComponent as Connections} from '../Resources/connections.svg'

import { TouchableOpacity, View, TextInput } from 'react-native-web';

import '../App.css';
import { styled } from 'styled-components';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import { appLocalDataDir, join } from '@tauri-apps/api/path';

import { exists, writeTextFile, BaseDirectory, readTextFile, createDir } from '@tauri-apps/api/fs';

//import { sqlite3 } from 'sqlite3';


// function createDatabase() {
//     var newdb = new sqlite3.Database(join(appLocalDataDir, 'workspaces.db'), (err) => {
//         if (err) {
//             console.log("Getting error " + err);
//             //exit(1);
//         }
//         //createTables(newdb);
//     });
// }

function WorkspaceCreator(){

    const [workspace, setWorkspace] = useState({name: '', files: []});
    const [workspaces, setExistingWorkspace] = useState([])
    

    const [workspace_name, setWorkspaceName] = useState('');
    const [message, setMessage] = useState("Name your space...");

    (async () =>{
            const appLocalDir = await appLocalDataDir();
            // const db = new sqlite3.Database(join(appLocalDataDir, 'workspaces.db'), sqlite3.OPEN_READWRITE, (err) => {
            //     if (err && err.code == "SQLITE_CANTOPEN") {
            //         createDatabase();
            //         return;
            //         } else if (err) {
            //             console.log("Getting error " + err);
            //             //exit(1);
            //     }
            //     //runQueries(db);
            // });
        }
    )();

    const try_create_workspace = async() => {
        if(workspace_name == ''){
            setMessage("Name can't be empty");
            return;
        }

        const filename = workspace_name + '.json';

        const config = 'workspace_config.json';

        const ex_workspaces_file = await exists(config, {dir: BaseDirectory.AppLocalData});


        if(ex_workspaces_file === true){
            const workspaces_content = await readTextFile(config, {dir: BaseDirectory.AppLocalData});
            console.log("is read from file");
            console.log(workspaces_content);

            const arr = JSON.parse(workspaces_content);

            console.log(arr);

            setExistingWorkspace(arr.ex_workspaces);
        }

        if(workspaces.includes(workspace_name)){
            setWorkspaceName('');
            setMessage("The name is already used");
            return;
        }
        
        console.log("asasd");
        console.log(workspace_name);

        setExistingWorkspace((prev) => [
            ...prev, {name: workspace_name}
        ]);

        console.log(workspaces);

        const existingWorkspacesJSON = JSON.stringify({ex_workspaces: workspaces});

        console.log(existingWorkspacesJSON);

        await writeTextFile(config, existingWorkspacesJSON, {dir: BaseDirectory.AppLocalData});
        
        
        setWorkspace({name: workspace_name, files: []});

        const workspaceJSON = JSON.stringify(workspace);

        console.log("Saving...");

        console.log(filename);

        await writeTextFile(filename, workspaceJSON, {dir: BaseDirectory.AppLocalData});

        setExistingWorkspace((prev) => [
            ...prev, workspace_name
        ]);
    }

    const Title = styled.p`
        color: white;
    `;

    return(
        <div className='Inner-Box' style={{display: 'flex', flexDirection: 'row'}}>
          
            <div style={{flex: 2}}>
                <p className='header' style={{fontSize: 20, fontStyle: "italic"}}>Journey starts here</p>
                <TextInput style={{backgroundColor: '#262626', height: 40, color: 'white', padding: 10, fontSize: 20, marginBottom: 10}}
                    value={workspace_name}
                    onChangeText={text => {setWorkspaceName(text); setMessage("Name your space...")}}
                    placeholder={message}
                 />

                <TouchableOpacity onPress={try_create_workspace}>
                    <div style={{display: 'flex', flex: 1, flexDirection: 'row', backgroundColor: '#581f93', width: 'max-content', paddingLeft: 10, paddingRight: 10, borderRadius: 10, alignItems: 'center'}}>
                        <p style={{color: 'white', textAlign: 'center'}}>Create</p>
                    </div>
                </TouchableOpacity>
            </div>
    
    
            <div className='box-auto-height' style={{flex: 1}}>
              
              <div style={{backgroundColor: '#212020', padding: 10, border: 2, borderRadius: 15, display: 'block'}}>
    
                <h2 style={{color: 'white'}}>Time to make your writtings <span style={{color: '#C084FC'}}>shine</span></h2>
    
                <p style={{color: 'white', marginTop: -10, marginBottom: -10}}>Upload your documents and notes and make them:</p>
    
                <ul style={{color: 'white'}}>
                  <li>organized</li>
                  <li>searchable</li>
                  <li>interconnected</li>
                </ul>
    
                <p style={{color: 'white', marginTop: -10, marginBottom: -10}}>Bring them to life and create an explorable Space to share with others!</p>/
    
                <div className='align-self-center'>
                  <Connections style={{}}/>
                </div>
    
                <h2 style={{color: 'white'}}>Already have your Second Brain?</h2>
    
                <p style={{color: 'white'}}>Import needed notes from Obsidian, Notion, Evernote and others! Click this magic button:</p>
    
                <div className='align-self-center'>
                  <Link to={'/file_add'} style={{textDecoration: 'none'}}>
                    <TouchableOpacity onPress={() => {}}>
                      <div style={{display: 'flex', flex: 1, flexDirection: 'row', backgroundColor: '#581f93', width: 'max-content', paddingLeft: 10, paddingRight: 10, borderRadius: 10, alignItems: 'center'}}>
                        <p style={{color: 'white', textAlign: 'center'}}>Import</p>
                      </div>
                    </TouchableOpacity>
                  </Link>
                </div>
            </div>
    
        </div>
    
      </div>
    );
}

export default WorkspaceCreator;