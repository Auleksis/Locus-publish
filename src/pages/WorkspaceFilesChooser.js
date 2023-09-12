import '../App.css';
import {ReactComponent as Plus} from '@res/plus.svg'
import {ReactComponent as Connections} from '@res/connections.svg'
import {ReactComponent as ThreeLines} from "@res/threeLines.svg";
import {ReactComponent as VerticalFileLine} from "@res/vertical_file_line.svg"
import {ReactComponent as Cross} from "@res/cross.svg"
import {ReactComponent as Burger } from "@res/burger.svg"
import {ReactComponent as Wand} from "@res/wand.svg";
import {ReactComponent as FileTrigger} from "@res/file_trigger.svg";
import {ReactComponent as FileTriggerSelected} from "@res/file_trigger_selected.svg";

import { FixedSizeList } from 'react-window';

import { TouchableOpacity, View, TextInput } from 'react-native-web';

import { styled } from 'styled-components';
import { Link } from 'react-router-dom';
import { useEffect, useState, useLayoutEffect } from 'react';
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

import '@styles/WorkspaceFileChooser.css';



const invokeT = window.__TAURI_IPC__.invoke;

appWindow.listen("tauri://destroyed", (event) => {
  const workSpaceManager = new WorkSpaceManager();
  workSpaceManager.saveWorkSpaceCore();
});

function WorkspaceFilesChooser({workspaceName}){

  /**
   * VARIABLES
   */

  const [spaceDocs, setSpaceDocs] = useState([]);
  const [openedText, setOpenedText] = useState('');
  const [textName, setTextName] = useState('');

  const [isSearching, setSearching] = useState(false);
  const [searchedWords, setSearchedWords] = useState("");

  const [foundDocs, setFoundDocs] = useState([]);

  const [canShowTip, setCanShowTip] = useState(true);

  const [showConnections, setShowConnections] = useState(true);

  const [isCreatingSpace, setCreatingSpace] = useState(false);

  const [selectedIDForNewSpace, setSelectedIDForNewSpace] = useState([]);



  /**
   * FUNCTIONS
   */

  const handleResize = () => {
    var windowSize = [window.innerWidth, window.innerHeight];
    var screenSize = [window.screen.availWidth, window.screen.availHeight];

    const vh = windowSize[1] / 100;

    const leftBox = document.getElementById('left-box');
    const leftBoxHeight = leftBox.offsetHeight;

    const rightBox = document.getElementById('right-box');
    const rightBoxHeight = rightBox.offsetHeight;

    const connectionsHeight = 226 / 837 * vh / 10;


    if(windowSize[1] <= 710){
      setCanShowTip(false);
    }else{
      setCanShowTip(true);
    }

    if(windowSize[0] <= screenSize[0] / 2 || windowSize[1] < 800 || (windowSize[0] < 1280 && windowSize[1] < 900)){
      setShowConnections(false);
    }
    else{
      setShowConnections(true);
    }
  };

  useLayoutEffect(() => {
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // useEffect(() => {
  //   if(searchedWords.length > 0){
  //     const words = searchedWords.trim();
  //     if(words.length > 0){
  //       const workSpaceManager = new WorkSpaceManager();
  //       setSearching(true);
  //       setFoundDocs((prev) => [...workSpaceManager.search(searchedWords)]);

  //       let text = openedText;
  //       const regexForContent = new RegExp(searchedWords, 'gi');
  //       text = text.replace(regexForContent, `<span style="background-color: #C084FC">$&</span>`);
  //       let textViewerContent = `<p style="color: white">${text}</p>`;
  //       document.getElementById("textViewer").innerHTML = textViewerContent;
  //     }else{
  //       setSearching(false);
  //       let textViewerContent = `<p style="color: white">${openedText}</p>`;
  //       document.getElementById("textViewer").innerHTML = textViewerContent;
  //     }
  //   }else{
  //     setSearching(false);
  //     let textViewerContent = `<p style="color: white">${openedText}</p>`;
  //     document.getElementById("textViewer").innerHTML = textViewerContent;
  //   }
  // }, [searchedWords]);

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

    if(data._title !== textName){

      const contents = await data.getFileContents();

      setOpenedText(contents); 
      
      setTextName(data._title);
    }
    else{
      setOpenedText('');
      setTextName('');  
    }

    // let text = contents;
    // const regexForContent = new RegExp(searchedWords, 'gi');
    // text = text.replace(regexForContent, `<span style="background-color: #C084FC">$&</span>`);
    // let textViewerContent = `<p style="color: white">${text}</p>`;
    // document.getElementById("textViewer").innerHTML = textViewerContent;
  };

  const clickSelectForNewSpace = (file) => {
    if(selectedIDForNewSpace.includes(file.id)){
      const fileIndex = selectedIDForNewSpace.indexOf(file.id);
      selectedIDForNewSpace.splice(fileIndex, 1);
    }
    else{
      setSelectedIDForNewSpace((prev) => [...selectedIDForNewSpace, file.id]);
    }
  }

  const newSpaceClicked = () => {
    setCreatingSpace(true);
  }

  const cancelSpaceCreationClicked = () => {
    setSelectedIDForNewSpace([]);
    setCreatingSpace(false);
  }

  const renderContents = () => {
    return(
      <div className='right-box-info' id='right-box'>
            
            <div className='info-box-content'>
                  
              <div 
                id='textViewer'
                className='text-viewer'>
                <h2 className='highweight-title'>
                  <span className='usual-text'>
                    {textName}
                  </span>
                </h2>

                <p className='simple-paragraph'>
                  <span className='usual-text'>
                    {openedText}
                  </span>
                </p>
              </div>
              
            </div>
            
      </div>
    );
  };

  const renderConnections = () => {
    if(showConnections){
      return(
        <div className='connections-div'>
          <Connections className='connections'/>
        </div>
      );
    }
    else{
      return(
        <div className='connections-div'>
          
        </div>
      );
    }
  }

  const renderTip = () => {
    return(
      <div className='right-box' id='right-box'>
              
              <div className='info-box'>

                  <h2 className='highweight-title'>
                    <span className='usual-text'>Time to make your writings </span>
                    <span className='highlighted-text'>shine</span>
                  </h2>
      
                  <div className='info-list-part'>
                    <div className='zero-margin'>
                  
                      <p className='simple-paragraph'>
                        <span className='usual-text'>
                          Upload your documents and notes and make them:
                        </span>
                      </p>
                    
        
                      <ul className='simple-paragraph'>
                        <li className='usual-text'>organized</li>
                        <li className='usual-text'>searchable</li>
                        <li className='usual-text'>interconnected</li>
                      </ul>

                      <p className='simple-paragraph'>
                        <span className='usual-text'>
                          Bring them to life and create an explorable Space to share with others!
                        </span>
                      </p>
                    </div>
                  </div>
    
                  {
                    renderConnections()
                  }
      
                  <div className='question-label'>
                    <h2 className='highweight-title'>
                      <span className='usual-text'>
                        Already have your Second Brain?
                      </span>
                    </h2>
                  </div>

                  <div className='import-desc-box'>
                    <div className='zero-margin'>
                      <p className='simple-paragraph'>
                        <span className='usual-text'>
                          Import needed notes from Obsidian, Notion, Evernote and others! Click this magic button:
                        </span>
                      </p>
                    </div>
                  </div>
    
                  <div className='import-button-div'>
                    <Link to={'/workspace_file_chooser'} className='simple-link'>
                      <button className='import-button'>
                          <p className='simple-paragraph'>
                            <span className='usual-text'>
                              Import
                            </span>
                          </p>
                      </button>
                    </Link>
                  </div>


        </div>
              
      </div>
    );
  };

  const renderAvailableFileAction = (file) => {
    if (isCreatingSpace){
      return(
        <button 
          className='file-trigger'
          onClick={() => clickSelectForNewSpace(file)}>
            {selectedIDForNewSpace.includes(file.id) ? <FileTriggerSelected/> : <FileTrigger/>}
        </button>
      );
    }
    else{
      return(
        <button 
          className='cross-button'
          onClick={() => deleteFile(file.id)}>
            <Cross/>
        </button>
      );
    }
  }

  const renderFileRow = ({data, index, style}) =>{
    if(data[index]){
      return(
        <ListItem
          style={{...style}}
          className='list-item'
          key={index} 
          component="div"
          disablePadding 
          onClick={() => docSelected(data[index])}>

          <VerticalFileLine className='list-item-line'/>

          <button className={`list-item-button-${data[index].title === textName ? 'on' : 'off'}`}>

            <div className='name-label-div'>
              {/* <ListItemText primary={data[index].title}/> */}
              <p className='simple-paragraph'>
                <span className='usual-text'>
                  {data[index].title}
                </span>
              </p>
            </div>

            <div className='file-action-button-div'>
              {
                renderAvailableFileAction(data[index])
              }
            </div>

          </button>
        </ListItem>
      );
    }
  };

  const renderCreateSpaceOrCancle = () => {
    if(isCreatingSpace){
      return(
        <button 
          className='cancel-space-creation-button'
          onClick={cancelSpaceCreationClicked}>
          <p className='simple-paragraph'>
            <span className='usual-text'>
              Cancel
            </span>
          </p>
        </button>
      );  
    }
    else{
      return(
        <button 
          className='new-space-button'
          onClick={newSpaceClicked}>
          <p className='simple-paragraph'>
            <span className='usual-text'>
              New Space
            </span>
          </p>
        </button>
      );
    }
  }

  const renderUploadFilesOrContinue = () => {
    if(isCreatingSpace){
      return(
        <button 
          className='upload-files-button' 
          onClick={selectFiles}>
            <p className='simple-paragraph'>
              <span className='usual-text'>
                Continue
              </span>
            </p>
        </button>
      );
    }
    else{
      return(
        <button 
          className='upload-files-button' 
          onClick={selectFiles}>
            <Plus className='plus'/>
            <p className='simple-paragraph'>
              <span className='usual-text'>
                Upload files
              </span>
            </p>
        </button>
      );
    }
  }

  const renderRightBox = () => {
    if(openedText === '' && canShowTip){
      return renderTip();
    }
    else{
      return renderContents();
    }
  };

  // <div>
  //               <TextInput style={{backgroundColor: '#262626', height: 'auto', color: 'white', padding: 10, fontSize: 20, marginRight: 30}}
  //                     value={searchedWords}
  //                     onChangeText={text => {setSearchedWords(text)}}
  //                     placeholder={"Type to search..."}
  //               />
  //           </div>


  /**
   * LAYOUT
   */

  return(
      <div className='main-box'>
        
          <div className='left-box' id='left-box'>

            <div className='up-bar'>

              <div className='your-notes'>
                <ThreeLines className='your-notes-margin'/>
                <div className='your-notes-margin'>
                  <h1 className='special-title'>Your notes</h1>
                </div>
                <Burger/>
              </div>

              <div className='searchbardiv'>
                <button className='searchbar'>
                  
                  <div>
                    <p className='simple-paragraph'>
                      <span className='usual-text'>
                        Search
                      </span>
                    </p>
                  </div>

                  <div className='wand-div'>
                    <Wand className='wand'/>
                  </div>

                </button>
              </div>

            </div>

            <div className='list-div'>
              <AutoSizer>
                {({height, width}) => (
                  <FixedSizeList 
                    className={"scrollbar"}
                    height={height}
                    width={width}
                    itemSize={80}
                    itemCount={spaceDocs.length}
                    overscanCount={5} 
                    itemData={isSearching ? foundDocs : spaceDocs}
                    >
                    {renderFileRow}
                  </FixedSizeList>
                )}
              </AutoSizer>    
            </div>

            <br></br>
            
            <div className='bottom-div'>

              <div className='new-space-div'>
                {renderCreateSpaceOrCancle()}
              </div>

              <div className='upload-files-div'>
                {renderUploadFilesOrContinue()}
              </div>

            </div>
          </div>
  
          {
            renderRightBox()
          }
          
  
      </div>
  );
}

export default WorkspaceFilesChooser;