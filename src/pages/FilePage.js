import '../App.css';
import {ReactComponent as Plus} from '../Resources/plus.svg'
import {ReactComponent as Connections} from '../Resources/connections.svg'

import { TouchableOpacity, View, TextInput } from 'react-native-web';

import '../App.css';
import { styled } from 'styled-components';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {FlatList} from 'react-native-web';
import { appLocalDataDir, join } from '@tauri-apps/api/path';

import { exists, writeTextFile, BaseDirectory, readTextFile, createDir } from '@tauri-apps/api/fs';

import {open} from '@tauri-apps/api/dialog';

import { invoke } from '@tauri-apps/api';
import { isLabelWithInternallyDisabledControl } from '@testing-library/user-event/dist/utils';
const invokeT = window.__TAURI_IPC__.invoke;


const {Index} = require('flexsearch');

function FilePage(){

    const [opened_docs, setOpenedDocs] = useState([]);

    const [last_index_id, setIndexID] = useState(0);

    const [filenames, setFileNames] = useState([]);

    const [workspace_name, setWorkspaceName] = useState('');
    const [message, setMessage] = useState("Locus");

    const [found, setFound] = useState([]);

    const [showed, setShowed] = useState('');

    const option = {
        charset: "latin:extra",
        preset: 'match',
        tokenize: 'strict',
        cache: false,
    }

    const search = () =>{
        const mindex = new Index(option);

        var counter = 0;

        opened_docs.forEach((doc) => {
            doc.id = counter;
            mindex.add(counter, doc.title);
            counter++;
        });

        console.log(opened_docs);

        try{
            const ids = mindex.search(workspace_name);
            //console.log(ids);
            // based on the ids returned by the index, look for the recipes for those ids
            const result = opened_docs.filter((doc) => ids.includes(doc.id));
            console.log(result);

            setFound(result);

            console.log(found);
        }
        catch(e){
            console.log(e);
        }    
    }


    const selectFiles = async() => {
        const selected = await open({
            multiple: true,
          });
        
          //console.log(selected);
        
          if(selected.length == 1){
            //console.log(selected[0]);
            //СДЕЛАТЬ ПРОВЕРКУ НА ТО, ЧТО ЭТОТ ФАЙЛ УЖЕ БЫЛ ДОБАВЛЕН!
            var got = await invoke('read_file_string', {filepath: selected[0]});
        
            console.log(got);
            //index.add(last_index_id, got);
        
            setOpenedDocs((prev) => [...prev, {id: last_index_id, title: got}]);

            setFileNames((prev) => [...prev, {id: last_index_id, name: selected[0]}]);
        
            setIndexID(last_index_id + 1);
        
            //console.log(opened_docs);
          }
          else{
            for(const s of selected){
                var got = await invoke('read_file_string', {filepath: s});
        
                //console.log(got);
                //index.add(last_index_id, got);
            
                setOpenedDocs((prev) => [...prev, {id: last_index_id, title: got}]);
    
                setFileNames((prev) => [...prev, {id: last_index_id, content: s}]);
            
                setIndexID(last_index_id + 1);
            }
          }
          console.log("currently opened:");
          console.log(filenames);
          console.log(opened_docs);
    }

    const show_result = () => {
        var text = '';
        for(const f of found){
            text += f.title;
            text +='\n';
        }

        setShowed(text);
    };


    return(
        <div className='Inner-Box' style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{display: 'flex', justifyItems: 'center', flex: 2}}>
                <TouchableOpacity onPress={selectFiles}>
                        <div style={{display: 'flex', flex: 1, flexDirection: 'row', backgroundColor: '#581f93', width: 'max-content', paddingLeft: 10, paddingRight: 10, borderRadius: 10, alignItems: 'center', alignContent: 'center', height: 'max-content'}}>
                            <p style={{color: 'white', textAlign: 'center'}}>Choose files</p>
                        </div>
                </TouchableOpacity>

                {/* <ReactScrollableList
                    listItems={filenames}
                    heightOfItem={30}
                    maxItemsToRender={50}
                    style={{ color: '#333' }}
                />             */}
            </div>

            <div className='box-auto-height' style={{flex: 1}}>
                <p style={{color: 'white'}}>Write a word to start searching:</p>

                <TextInput style={{backgroundColor: '#262626', height: 40, color: 'white', padding: 10, fontSize: 20, marginBottom: 10}}
                    value={workspace_name}
                    onChangeText={text => {setWorkspaceName(text); setMessage("Locus")}}
                    placeholder={message}
                 />

                <TouchableOpacity onPress={search}>
                    <div style={{display: 'flex', flex: 1, flexDirection: 'row', backgroundColor: '#581f93', width: 'max-content', paddingLeft: 10, paddingRight: 10, borderRadius: 10, alignItems: 'center'}}>
                        <p style={{color: 'white', textAlign: 'center'}}>Find!</p>
                    </div>
                </TouchableOpacity>

                <TouchableOpacity onPress={show_result}>
                    <div style={{display: 'flex', flex: 1, flexDirection: 'row', backgroundColor: '#581f93', width: 'max-content', paddingLeft: 10, paddingRight: 10, borderRadius: 10, alignItems: 'center'}}>
                        <p style={{color: 'white', textAlign: 'center'}}>Show result!</p>
                    </div>
                </TouchableOpacity>

                <p style={{color: 'white', textAlign: 'center'}}>{showed}</p>
            </div>
        </div>
    );
}

export default FilePage;