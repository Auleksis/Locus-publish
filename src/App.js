import logo from './logo.svg';
import '@src/App.css';
import { styled } from 'styled-components';

import {ReactComponent as Plus} from './Resources/plus.svg'
import {ReactComponent as Connections} from './Resources/connections.svg'

import { TouchableOpacity, View } from 'react-native-web';

import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from 'react';

import {BaseDirectory, createDir, readTextFile} from '@tauri-apps/api/fs';
import {appLocalDataDir, documentDir } from '@tauri-apps/api/path';

import {open} from '@tauri-apps/api/dialog';

import {Routes, Route, useNavigate} from 'react-router-dom';

import StartPage from './pages/StartPage';
import FilePage from './pages/FilePage';
import WorkspaceCreator from './pages/WorkspaceCreator';
import WorkspaceFilesChooser from './pages/WorkspaceFilesChooser';
import { TauriFileManager } from './storage/TauriFileManager';
import { appDataDir, join } from '@tauri-apps/api/path';

const invokeT = window.__TAURI_IPC__.invoke;

const {Index} = require('flexsearch');



function App({firstStart}) {
  const navigate = useNavigate();

  useEffect(() => {
    if(firstStart === false){
      //const timeout = setTimeout(() => navigate('/workspace_file_chooser'), 1);
      //return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<StartPage/>}/>
        <Route path='workspace_file_chooser' element={<WorkspaceFilesChooser workspaceName={'Your Notes'}/>}/>
        <Route path='workspace_creator' element={<WorkspaceCreator/>}/>
      </Routes>
    </div>
  );

  //<input type='file' onChange={readFile} id='fr'/>
}

export default App;
