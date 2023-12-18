import React, { useState } from "react";
import "./App.css";
import Header from "../src/components/Header";
import TreeViewContainer from "../src/components/TreeViewContainer";
import DataGridView from "../src/components/DataGridView";

function App() {
  const [selectedNodeData, setSelectedNodeData] = useState(null);

  return (
    <div className="container">
      <Header />
      <TreeViewContainer setSelectedNodeData={setSelectedNodeData} />
      <DataGridView selectedNodeData={selectedNodeData} />
    </div>
  );
}

export default App;
