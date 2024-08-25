/**
 * Author: Alexander Ganiev (Aulex)
 * Creation Date: 19.09.2023
 */

import "@styles/SearchPage.css";

import WorkFolderManager from "@src/storage/LocusWorkspace/WorkFolderManager";
import { WorkSpaceManager } from "@src/storage/LocusWorkspace/WorkSpaceManager";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";

import { ReactComponent as Burger } from "../Resources/burger.svg";
import { ReactComponent as ThreeLines } from "../Resources/threeLines.svg";
import { ReactComponent as Circle } from "../Resources/circle.svg";
import { ReactComponent as Wand } from "../Resources/wand.svg";
import { ListItem } from "@mui/material";

/**
 *
 * @param currentWorkspace - is a present space from the page has been loaled
 * @param loadedFiles - is an array of loaded files from the current workspace
 * @returns an HTML page for searching
 */
function SearchPage() {
  //VARS

  //MAIN FIELDS
  const { workspaceName } = useParams(); //Get workspaceName from URL

  const [workspace, setWorkSpace] = useState({});

  const [request, setRequest] = useState("");

  //FOR FUTURE

  // SET UP SEARCH OPTIONS LIKE SEARCH ENGINE, WHICH FILES TO SEARCH AND SO ON
  // const [searchOptions, setSearchOptions] = useState({});

  //SET UP HOW TO DISPLAY RESULT
  //INCLUDES OPTIONS FOR BOTH TEXT AND GRAPH MODES
  //const [displayOptions, setDisplayOptions] = useState({});

  //ADDITIONAL FIELDS

  //BUFFER FOR LOADED FILES FROM THE CHOSEN WORKSPACE AND THEIR CONTENT
  const [filesBuffer, setFilesBuffer] = useState([]);

  //BUFFER FOR FOUND FILES BY A REQUEST
  const [foundFiles, setFoundFiles] = useState([]);

  //BUFFER FOR TEXT OF LOADED FILES
  //FILL WITH ARRAY OF OBJECTS TYPE OF {TEXT_NAME, TEXT_CONTENT}
  //FIXME: THIS BUFFER SHOULD HAVE A SMALL SIZE BECAUSE A WORKSPACE MAY CONSTIS OF A LOT OF LARGE FILES!
  const [filesText, setFilesText] = useState([]);

  //UI FIELDS
  const [searchbarInput, setSearchbarInput] = useState();

  //------------------------------------------------------------------

  //LOGIC

  //LAOD WOKSPACE AND ITS FILES WHEN THE PAGE APPEARS
  useEffect(() => {
    const workFolderManager = WorkFolderManager.instance;

    const space = workFolderManager.getWorkSpace(workspaceName);

    setWorkSpace(space);

    const workspaceManager = new WorkSpaceManager();

    const loadFiles = async () => {
      await workspaceManager.setWorkspace(space);

      const spaceFiles = workspaceManager.getAllFiles();

      //LOAD FILES TEXT
      let finalBuf = [];

      for (let i = 0; i < spaceFiles.length; i++) {
        const text = await spaceFiles[i].getFileContents();
        finalBuf.push({ workfile: spaceFiles[i], textContent: text });
      }

      setFilesBuffer(finalBuf);
    };

    loadFiles();

    console.log(space);
  }, []);

  //SET UP UI FIELDS
  useEffect(() => {
    const searchbarInputElement = document.getElementById("searchbarInput");
    setSearchbarInput(searchbarInputElement);
  }, []);

  //HANDLE REQUESTS
  useEffect(() => {
    const manager = new WorkSpaceManager();
    const found = manager.search(request);

    let files = [];

    for (let i = 0; i < found.length; i++) {
      const index = (file) => file.workfile === found[i];

      const foundWithContent = filesBuffer[filesBuffer.findIndex(index)];

      files.push(foundWithContent);
    }

    setFoundFiles(files);
  }, [request]);

  //HANDLE SWITCHING WORKSPACES
  const switchWorkspace = () => {};

  //------------------------------------------------------------------

  //UI LOGIC

  const onSearchbarInputChanged = () => {
    const request = searchbarInput.innerText;
    setRequest(request);
  };

  //------------------------------------------------------------------

  //USEFUL TOOLS

  /**
   * This function returns an interval of words consisting of words before and after the searched word.
   * @param originalText - a text where the searched word could be.
   * @param intervaLength - full length of interval. Words which are placed from the searched word not further than intervaLength / 2 will be included.
   * @returns an interval of words
   */
  const getTextSummuryByRequest = (originalText, intervaLength) => {
    const regexForContent = new RegExp(request.trim(), "gim");

    console.log("SUMMARY FORMATION:");

    console.log("ORIGINAL:");
    console.log(originalText);

    const word_index = originalText.search(regexForContent);

    if (word_index < 0) return;

    const len = originalText.length;

    const delta = 25;

    let leftBorder = word_index - delta;
    let rightBorder = word_index + delta;

    let rightAppendix = "";
    let leftAppendix = "";

    if (leftBorder < 0) {
      leftBorder = 0;
    }

    if (rightBorder >= len) {
      rightBorder = len - 1;
    }

    //APPENDIX LOGIC
    if (leftBorder > 0) {
      leftAppendix = "...";
    }

    if (rightBorder < len) {
      rightAppendix = "...";
    }

    const displayedText =
      leftAppendix +
      originalText.substring(leftBorder, rightBorder) +
      rightAppendix;

    console.log("MODIFIED");
    console.log(displayedText);

    return displayedText;
  };

  //------------------------------------------------------------------

  //CONDITIONAL RENDER

  const renderWorkspaceImage = () => {
    if (workspaceName !== "Your Notes") {
      return <Circle className="workspace-image" />;
    }
  };

  const renderFoundFile = ({ data, index, style }) => {
    if (data[index]) {
      return (
        <ListItem
          style={{ ...style }}
          className="list-item"
          key={index}
          component="div"
          disablePadding
        >
          <button className="found-file-item-button">
            <div className="found-file-item-name-div">
              <p className="simple-paragraph">
                <span className="usual-text">
                  <span className="weight-700">
                    {data[index].workfile._title}
                  </span>
                </span>
              </p>
            </div>

            <div className="found-file-preview-text-div">
              <p className="simple-paragraph">
                <span className="usual-text">
                  {getTextSummuryByRequest(data[index].textContent)}
                </span>
              </p>
            </div>
          </button>
        </ListItem>
      );
    }
  };

  //------------------------------------------------------------------

  //RENDER

  return (
    <div className="page-box">
      <div className="up-bar">
        <div className="your-notes">
          <ThreeLines className="your-notes-margin" />

          {renderWorkspaceImage()}

          <div className="your-notes-margin">
            <h1 className="special-title">{workspaceName}</h1>
          </div>
        </div>

        <div className="back-to-space-div">
          <Link className="simple-link" to={"/workspace_file_chooser"}>
            <button className="back-to-space-button">
              <div className="back-to-space-text">
                <p className="simple-paragraph">
                  <span className="usual-text">Back to Space</span>
                </p>
              </div>

              <Burger />
            </button>
          </Link>
        </div>
      </div>

      <div className="searchbar-div">
        <div className="searchbar-rect">
          <div className="searchbar-input-div">
            <span
              className="searchbar-input"
              id="searchbarInput"
              contentEditable
              placeHolder="Find anything and ask questions"
              focusedPlaceHolder="Start typing..."
              onKeyUp={onSearchbarInputChanged}
              tabIndex={0}
            ></span>
          </div>

          <div className="wand-div">
            <Wand />
          </div>
        </div>
      </div>

      <div className="middle-div">
        <div className="display-ways-div">
          <button className="list-view-button">
            <p className="simple-paragraph">
              <span className="usual-text">List view</span>
            </p>
          </button>

          <button className="graph-view-button">
            <p className="simple-paragraph">
              <span className="usual-text">Graph view</span>
            </p>
          </button>
        </div>

        <div className="result-d-div">
          <p className="simple-paragraph">
            <span className="usual-text">
              All notes linked to or mentioning the terms
            </span>
          </p>
        </div>
      </div>

      <div className="found-files-list-div">
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              className={"found-files-list-scrollbar"}
              height={height}
              width={width}
              itemSize={125}
              itemCount={foundFiles.length}
              overscanCount={5}
              itemData={foundFiles}
            >
              {renderFoundFile}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}

export default SearchPage;
