import {ReactComponent as Plus} from '@Res/plus.svg'
import {ReactComponent as Connections} from '@Res/connections.svg'

import { TouchableOpacity, View } from 'react-native-web';

import '@src/App';

import '@styles/StartPage.css';

import { styled } from 'styled-components';
import { Link } from 'react-router-dom';

function StartPage(){
  
  const Title = styled.p`
    color: white;
  `;

    return (
          <div className='Inner-Box' style={{display: 'flex', flexDirection: 'row'}}>
          
            <div style={{flex: 2}}>
              <p className='special-title'>Hello</p>
    
              <Link to={'/workspace_file_chooser'} style={{textDecoration: 'none'}}>
                <TouchableOpacity onPress={() => {}}>
                  <div className="upload-button" style={{display: 'flex', flexDirection: 'row', borderRadius: 15, border: 2, paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, alignItems: 'center', width: 'max-content'}}>
                    <Plus style={{marginRight: 10}}/>
                    <Title><span style={{color: "#C084FC"}}>Upload</span> files </Title>
                  </div>   
                </TouchableOpacity>
              </Link>
    
              <p style={{color: 'white'}}>{}</p>
            </div>
    
    
            <div className='box-auto-height' style={{flex: 1}}>
              
              <div style={{backgroundColor: '#212020', padding: 10, border: 2, borderRadius: 15}}>
    
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
                  <Link to={'/workspace_file_chooser'} style={{textDecoration: 'none'}}>
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

export default StartPage;