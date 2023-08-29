// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

//extern crate filetime;

use core::panic;
use std::fs;

use std::fs::Metadata;
use std::fs::OpenOptions;
use std::io::Read;
use std::io::Seek;
use std::io::SeekFrom;
use std::io::Write;
use std::io::BufReader;
use std::fs::File;
use std::time::SystemTime;
use std::path::Path;

use home::home_dir;
use serde::Deserialize;
use serde::Serialize;

use filetime::FileTime;

#[derive(Debug)]
struct Cat{
  id: i32,
  name: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct FileStat{
  path: String,
  ctime: i64,
  mtime: i64,
  size: u64,
  //mode: u64, //for Unix only
  originalFilepath: String,
  isFile: bool,
  isDirectory: bool,
}


fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![read_file_string, read_all_file, read_file, file_stat, try_file_exists, copy_file_to, create_folder, create_file, remove_file, hello])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}


#[tauri::command]
fn hello(){
  println!("Hi there!");
}


#[tauri::command]
fn open_file_test(text: String){
  let mut file = OpenOptions::new()
    .create(true)
    .append(true)
    .open("../tasks.txt")
    .expect("Ошибка при открытии файла");

    writeln!(file, "{}", text).expect("Ошибка при открытии файла");
}

#[tauri::command]
fn read_file_string(filepath: String) -> Result<String, ()> {
  println!("file path:");
  println!("{}", filepath);
  let data = fs::read_to_string(filepath).expect("There is no such file!!!");
  

  println!("{}", data);

  Ok(data.into())
}


#[tauri::command]
fn read_all_file(path: String, encoding: String) -> Result<String, String>{
    let mut file = File::open(path).expect("File does not exist in read_all");

    let mut contents = Vec::new();

    file.read_to_end(&mut contents).expect("Impossible finish reading to the end");

    if encoding.eq("utf-8") || encoding.eq("utf8") {
      let utf_content = match String::from_utf8(contents) {
          Ok(v) => v,
          Err(e) => panic!("Invalid UTF-8 sequence: {}", e),
      };

      return Ok(utf_content);
    }

  Ok("".to_string())
}

#[tauri::command]
fn read_file(path: String, length: u64, start_pos: u64, encoding: String) -> Result<String, String>{

  let file_open_result = File::open(path);

  let mut file = match file_open_result {
      Ok(file) => file,
      Err(error) => panic!("An error has accured: {}", error),
  };

  let _change_cursor_pos = match file.seek(SeekFrom::Start(start_pos)) {
      Ok(v) => v,
      Err(e) => panic!("Invalid start position: {}", e),
  };

  let mut handler = file.take(length);

  let mut contents = Vec::new();

  let _read_result = match handler.read_to_end(&mut contents){
    Ok(v) => v,
    Err(e) => panic!("Reading error: {}", e),
  };

  if encoding.eq("utf-8") || encoding.eq("utf8"){
    let utf_content = match String::from_utf8(contents) {
        Ok(v) => v,
        Err(e) => panic!("Invalid UTF-8 sequence: {}", e),
    };

    println!("Got {}, {}, {}", utf_content, start_pos, length);

    return Ok(utf_content);
  }

  println!("End is reached!");
  
  Ok("".to_string())
}

#[tauri::command]
fn file_stat(path: String) -> Result<FileStat, String>{
  let metadata = match fs::metadata(&path){
    Ok(m) => m,
    Err(error) => panic!("Error while trying to get metadata: {}", error),
  };

  //println!("{:?}", metadata.created());

  let creation_file_time = FileTime::from_creation_time(&metadata).unwrap();
  let ctime = creation_file_time.unix_seconds();

  let modification_time = FileTime::from_last_modification_time(&metadata);
  let mtime = modification_time.unix_seconds();

  let is_file = metadata.is_file();
  let is_dir = metadata.is_dir();

  let file_size = metadata.len();

  //for UNIX only
  //let mode = metadata.permissions();

  //BAD CODE
  //BUT NOW I DON"T KNOW HOW TO CORRECT IT
  let path_cloned = String::from(&path);

  let fstat = FileStat{path: path, ctime: ctime, mtime: mtime, size: file_size, originalFilepath: path_cloned, isFile: is_file, isDirectory: is_dir};

  println!("{:?}", fstat);

  Ok(fstat)
}

#[tauri::command]
fn try_file_exists(path: String) -> Result<bool, ()>{

  //For some reason 'try_exists().is_ok()' always returns true
  //That's why I've decided to use exists
  //However it's not a good solution!
  //It can produce TOCTOU bugs

  let exists = Path::new(&path).exists();
  println!("exists p {}", path);
  println!("exists {}", exists);
  Ok(exists)
}

#[tauri::command]
fn copy_file_to(file_path: String, to_path: String) -> Result<bool, ()>{
  fs::copy(file_path, to_path).expect("Impossible to copy file");
  Ok(true)
}

#[tauri::command]
fn create_folder(path: String) -> Result<bool, ()>{
  println!("{}", path);
  fs::create_dir_all(path).expect("Impossible to create folder");
  Ok(true)
}

#[tauri::command]
fn create_file(path: String, contents: String, overwrite: bool) -> Result<bool, ()>{
  if overwrite{
    fs::write(path, contents).expect("Impossible to create new file");
  }
  Ok(true)
}

#[tauri::command]
fn remove_file(path: String) -> Result<bool, ()>{
  fs::remove_file(path).expect("Impossible ro remove the file");
  Ok(true)
}