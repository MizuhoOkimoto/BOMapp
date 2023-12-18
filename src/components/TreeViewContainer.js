import { useState } from "react";
import "./TreeViewContainer.css";
import TreeViewWindow from "./TreeViewWindow";
import APIService from "../services/APIService";

function TreeViewContainer({ setSelectedNodeData }) {
  const [data, setData] = useState(null);
  const [isPopulated, setIsPopulated] = useState(false);
  const [currentPart, setCurrentPart] = useState("");
  const [parentChildPart, setParentChildPart] = useState("");

  const handlePopulateClick = async () => {
    const fetchedData = await APIService.getData();
    setData(fetchedData);
    setIsPopulated(true);
  };

  // This is for the info section
  const handleNodeSelect = (fullPath, nodeData) => {
    setParentChildPart(fullPath);
    const parts = fullPath.split("\\");
    setCurrentPart(parts[parts.length - 1]);
    // Pass the selected node's data up to the App component
    setSelectedNodeData(nodeData);
  };

  return (
    <div className="treeview-container">
      <div className="treeview-window">
        {/* Pass the fetched data to the TreeViewWindow component */}
        <TreeViewWindow
          isPopulated={isPopulated}
          onNodeSelect={handleNodeSelect}
        />
      </div>
      <div className="info-section">
        <p>Parent Child Part: {parentChildPart}</p>
        <p>Current Part: {currentPart}</p>
        <div>
          <button
            className="populate-btn"
            onClick={handlePopulateClick}
            disabled={isPopulated}
          >
            Populate Data in Tree
          </button>
        </div>
        <div>
          {/* onClick={handleExitButtonClick} is removed from button */}
          <button className="exit-btn">Exit From Application</button>
        </div>
      </div>
    </div>
  );
}

export default TreeViewContainer;
