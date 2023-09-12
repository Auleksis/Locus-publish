import {ReactComponent as Plus} from '@res/plus.svg'
import {ReactComponent as Connections} from '@res/connections.svg'

import '@src/App';

import '@styles/StartPage.css';

import { styled } from 'styled-components';
import { Link } from 'react-router-dom';
import { useState, useEffect, useLayoutEffect } from 'react';

function StartPage(){
  const [showConnections, setShowConnections] = useState(true);

  const handleResize = () => {
    var windowSize = [window.innerWidth, window.innerHeight];
    var screenSize = [window.screen.availWidth, window.screen.availHeight];

    if(windowSize[0] <= screenSize[0] / 2 || windowSize[1] < 0.74 * screenSize[1] || (windowSize[0] < 1280 && windowSize[1] < 900)){
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
        <br/>
      );
    }
  }


  return (
    <div className='background'>
        <div className='main-box'>
          
          <div className='left-box'>
            <h1 className='special-title'>Hello</h1>
  
            <Link to={'/workspace_file_chooser'} style={{textDecoration: 'none'}}>
              <button className='upload-button'>
                  <Plus style={{marginRight: 10}}/>
                  <h2 className='upload-files-label'>
                    <span className='highlighted-text'>Upload </span>
                    <span className='usual-text'>files</span>
                  </h2>
              </button>
            </Link>

          </div>
  
  
          <div className='right-box'>
            
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
                  <Link to={'/workspace_file_chooser'} style={{textDecoration: 'none'}}>
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
  
        </div>
      </div>
  );
}

export default StartPage;