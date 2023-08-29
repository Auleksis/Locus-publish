import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom';

import { TauriFileManager } from './storage/TauriFileManager';

import { appDataDir, join } from '@tauri-apps/api/path';
import WorkFolderManager from './storage/LocusWorkspace/WorkFolderManager';

const root = ReactDOM.createRoot(document.getElementById('root'));

const appDataDirPath = await appDataDir();

const defaultFolder = await join(appDataDirPath, 'Notes');

//First setup
WorkFolderManager.initialize(defaultFolder);

//Check if it is the first start
async function isFirstStart(){
  const common_folder_not_existed = await WorkFolderManager.createDefaultFolder(defaultFolder);

  if(common_folder_not_existed){
    
  }

  return common_folder_not_existed;
}

const firstStart = await isFirstStart();

const folderManager = WorkFolderManager.instance;

if(firstStart){
  await folderManager.createWorkSpace("Your Notes");
  await folderManager.save();
}else{
  await WorkFolderManager.load();
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App firstStart={firstStart}/>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
