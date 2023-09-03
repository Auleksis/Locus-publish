import logo from './logo.svg';
import '@src/App.css';

import { useEffect, useState } from 'react';

import {Routes, Route, useNavigate} from 'react-router-dom';

import StartPage from '@pages/StartPage';
import WorkspaceFilesChooser from '@pages/WorkspaceFilesChooser';

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
      </Routes>
    </div>
  );

  //<input type='file' onChange={readFile} id='fr'/>
}

export default App;
