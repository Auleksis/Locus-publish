import logo from './logo.svg';
import '@src/App.css';

import { useEffect, useLayoutEffect, useState } from 'react';

import {Routes, Route, useNavigate} from 'react-router-dom';

import { initializeFirebase, testDB } from './publishing/FirebaseModule';

import StartPage from '@pages/StartPage';
import WorkspaceFilesChooser from '@pages/WorkspaceFilesChooser';
import SearchPage from './pages/SearchPage';

const DEFAULT_SIZE = [1400, 837];

function App({firstStart}) {
  initializeFirebase();
  testDB();

  const navigate = useNavigate();

  function updateFontSize (){
    const size = [window.innerWidth, window.innerHeight];

    const root = document.getElementById("root");

    const widthRatio = size[0] / DEFAULT_SIZE[0] * 100;
    const heightRatio = size[1] / DEFAULT_SIZE[1] * 100;
  
    

    // root.style.fontSize = `${Math.clamp(Math.min(widthRatio, heightRatio))}%`;
  }

  useEffect(() => {
    if(firstStart === false){
      // const timeout = setTimeout(() => navigate('/workspace_file_chooser'), 1);
      // return () => clearTimeout(timeout);
    }
  }, []);

  useLayoutEffect(() => {
    window.addEventListener('resize', updateFontSize);
    updateFontSize();
    return () => window.removeEventListener('resize', updateFontSize);
  }, []);

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<StartPage/>}/>
        <Route path='workspace_file_chooser' element={<WorkspaceFilesChooser workspaceName={'Your Notes'}/>}/>
        <Route path='search_page/:workspaceName' element={<SearchPage/>}/>
      </Routes>
    </div>
  );

  //<input type='file' onChange={readFile} id='fr'/>
}

export default App;
