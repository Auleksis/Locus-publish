import '../App.css';
import {ReactComponent as Plus} from '@res/plus.svg'
import {ReactComponent as Connections} from '@res/connections.svg'
import {ReactComponent as ThreeLines} from "@res/threeLines.svg";
import {ReactComponent as VerticalFileLine} from "@res/vertical_file_line.svg"
import {ReactComponent as Cross} from "@res/cross.svg"

import { FixedSizeList } from 'react-window';

import { TouchableOpacity, View, TextInput } from 'react-native-web';

import { styled } from 'styled-components';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {FlatList} from 'react-native-web';
import { appDataDir, join } from '@tauri-apps/api/path';

import { exists, writeTextFile, BaseDirectory, readTextFile, createDir } from '@tauri-apps/api/fs';

import {open} from '@tauri-apps/api/dialog';

import { event, invoke, path } from '@tauri-apps/api';
import { isLabelWithInternallyDisabledControl } from '@testing-library/user-event/dist/utils';

import { TauriFileManager } from '@storage/TauriFileManager';
import { FileManager } from '@src/storage/FileManager';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AutoSizer from "react-virtualized-auto-sizer";
import WorkFolderManager from '@src/storage/LocusWorkspace/WorkFolderManager';
import WorkSpace from '@src/storage/LocusWorkspace/WorkSpace';
import { WorkSpaceFile } from "@src/storage/LocusWorkspace/WorkSpaceFile";
import { WorkSpaceManager } from "@src/storage/LocusWorkspace/WorkSpaceManager";

import {appWindow} from '@tauri-apps/api/window';


const invokeT = window.__TAURI_IPC__.invoke;

appWindow.listen("tauri://destroyed", (event) => {
  const workSpaceManager = new WorkSpaceManager();
  workSpaceManager.saveWorkSpaceCore();
});

function WorkspaceFilesChooser({workspaceName}){
  const [spaceDocs, setSpaceDocs] = useState([]);
  const [openedText, setOpenedText] = useState([]);

  const [isSearching, setSearching] = useState(false);
  const [searchedWords, setSearchedWords] = useState("");

  const [foundDocs, setFoundDocs] = useState([]);

  useEffect(()=>{
    const folderManager = WorkFolderManager.instance;

    const space = folderManager.getWorkSpace(workspaceName); 

    const workSpaceManager = new WorkSpaceManager();
    
    const loadFiles = async() => {
      await workSpaceManager.setWorkspace(space);
      setSpaceDocs((prev) => [...workSpaceManager.current_core.includedFiles]);
    };   

    loadFiles();

  }, []);

  useEffect(() => {
    if(searchedWords.length > 0){
      const words = searchedWords.trim();
      if(words.length > 0){
        const workSpaceManager = new WorkSpaceManager();
        setSearching(true);
        setFoundDocs((prev) => [...workSpaceManager.search(searchedWords)]);

        let text = openedText;
        const regexForContent = new RegExp(searchedWords, 'gi');
        text = text.replace(regexForContent, `<span style="background-color: #C084FC">$&</span>`);
        let textViewerContent = `<p style="color: white">${text}</p>`;
        document.getElementById("textViewer").innerHTML = textViewerContent;
      }else{
        setSearching(false);
        let textViewerContent = `<p style="color: white">${openedText}</p>`;
        document.getElementById("textViewer").innerHTML = textViewerContent;
      }
    }else{
      setSearching(false);
      let textViewerContent = `<p style="color: white">${openedText}</p>`;
      document.getElementById("textViewer").innerHTML = textViewerContent;
    }
  }, [searchedWords]);

  const Title = styled.p`
    color: white;
  `;

  const selectFiles = async() => {
    const selected = await open({
        multiple: true,
    });

    if(selected){
    
      let fileManager = new TauriFileManager();

      let filesAdded = false;

      const workSpaceManager = new WorkSpaceManager();

      for(let i = 0; i < selected.length; i++){
        let item = selected[i];

        let itemExists = await fileManager.exists(item);

        if(itemExists === true){
          const pathParts = item.split(path.sep);
          const title = pathParts[pathParts.length - 1];

          if(spaceDocs.filter(d => d.title === title).length > 0){
            continue;
          }

          const file = await workSpaceManager.addFile(item);

          setSpaceDocs((prev) => [...prev, file]);

          filesAdded = true;
        }
      }

      if(filesAdded === true){
        workSpaceManager.saveWorkSpaceCore();
      }
    }
  }

  const deleteFile = async(fileID)=> {
    const workSpaceManager = new WorkSpaceManager();

    const deletedFile = await workSpaceManager.removeFile(fileID);

    setSpaceDocs((prev) => [...workSpaceManager.current_core.includedFiles]);

    const inFound = foundDocs.findIndex((value) => {
      return value.id === deletedFile.id;
    });

    if(inFound >= 0){
      foundDocs.splice(inFound, 1);
    }

    workSpaceManager.saveWorkSpaceCore();
  };

  const docSelected = async(data) => {
    console.log(data);

    const contents = await data.getFileContents();

    setOpenedText(contents);    

    let text = contents;
    const regexForContent = new RegExp(searchedWords, 'gi');
    text = text.replace(regexForContent, `<span style="background-color: #C084FC">$&</span>`);
    let textViewerContent = `<p style="color: white">${text}</p>`;
    document.getElementById("textViewer").innerHTML = textViewerContent;
  };

  const renderFileRow = ({data, index, style}) =>{
    if(data[index]){
      return(
        <ListItem style={{...style, color: 'white', backgroundColor: 'transparent', padding: 20}} key={index} component="div" disablePadding onClick={() => docSelected(data[index])}>
          <VerticalFileLine style={{marginRight: 20}}/>
          <div style={{width: style.width, display: 'flex', flexDirection: 'row'}}>
              <ListItemButton style={{padding: 5, backgroundColor: '#262626', borderRadius: 10}}>
                <ListItemText primary={data[index].title}/>
              </ListItemButton>
            <TouchableOpacity onPress={() => deleteFile(data[index].id)}>
              <Cross/>
            </TouchableOpacity>
          </div>
        </ListItem>
      );
    }
  }

  return(
      <div className='Inner-Box' style={{display: 'flex', flexDirection: 'row'}}>
        
          <div style={{flex: 2, paddingLeft: 15, paddingRight: 15}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <ThreeLines style={{marginRight: 10}}/>
                <p className='header' style={{fontSize: 20, fontStyle: "italic"}}>Your notes</p>
            </div>

            <div style={{display: 'flex', flexGrow: 1, height: '80%'}}>
              <AutoSizer>
                {({height, width}) => (
                  <FixedSizeList 
                    className={"customScrollBar"}
                    height={height}
                    width={width}
                    itemSize={60}
                    itemCount={spaceDocs.length}
                    overscanCount={5} 
                    itemData={isSearching ? foundDocs : spaceDocs}
                    >
                    {renderFileRow}
                  </FixedSizeList>
                )}
              </AutoSizer>    
            </div>
            
            <div style={{display: 'flex', flexDirection: 'row-reverse', paddingTop: 10}}>              
              <TouchableOpacity onPress={selectFiles}>
                      <div style={{display: 'flex', flex: 1, flexDirection: 'row', backgroundColor: '#262626', width: 'max-content', paddingLeft: 10, paddingRight: 10, borderRadius: 10, alignItems: 'center'}}>
                      <Plus style={{marginRight: 10}}/>
                        <p style={{color: 'white', textAlign: 'center'}}>Upload files</p>
                      </div>
              </TouchableOpacity>

              <TextInput style={{backgroundColor: '#262626', height: 'auto', color: 'white', padding: 10, fontSize: 20, marginRight: 30}}
                    value={searchedWords}
                    onChangeText={text => {setSearchedWords(text)}}
                    placeholder={"Type to search..."}
              />
            </div>
          </div>
  
  
          <div style={{flex: 1, height: '80vh'}}>
            
            <div style={{backgroundColor: '#212020', padding: 10, border: 2, borderRadius: 15, height: '100%', overflowY: 'scroll'}}>
                  
              <div id='textViewer'>
                <p style={{color: 'white'}}>{openedText}</p>
              </div>
              
            </div>
            
          </div>
  
      </div>
  );
}

export default WorkspaceFilesChooser;