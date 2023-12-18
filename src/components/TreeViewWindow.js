import React, { useState, useEffect } from "react";
import APIService from "../services/APIService";
import { TreeView, TreeItem } from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./TreeViewWindow.css";

function TreeViewWindow({ isPopulated, onNodeSelect }) {
  const [data, setData] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (isPopulated) {
        try {
          const result = await APIService.getData();
          const structuredData = buildTree(result);
          setData(structuredData);
          // Set the nodes that should be expanded. Here it's expanding all nodes.
          setExpandedNodes(structuredData.map((node) => node.COMPONENT_NAME));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [isPopulated]);

  /* buildTree function: Responsible for transforming the flat data from the API
  into a hierarchical structure that the TreeView component can use to render the tree. */
  const buildTree = (flatData) => {
    const nodesById = flatData.reduce((acc, node) => {
      // Uses the reduce method to transform the flat array flatData into an object (nodesById).
      acc[node.COMPONENT_NAME] = { ...node, children: [] }; // Each key in nodesById corresponds to a COMPONENT_NAME from the flatData array.
      return acc; // Each value in nodesById is an object representing a node, which is a copy of the original node from flatData with an additional children property initialized as an empty array.
    }, {});

    const rootNodes = []; // Initialize rootNodes as an empty array, which will eventually hold the top-level nodes of the tree(VALVE).
    flatData.forEach((node) => {
      if (node.PARENT_NAME) {
        // If the node has a parent, find the parent in the map and add this node as a child.
        const parentNode = nodesById[node.PARENT_NAME]; // PARENT_NAME as a key
        if (parentNode) {
          parentNode.children.push(nodesById[node.COMPONENT_NAME]); // If the parent node is found, I add this node to the parent's children array.
        }
      } else {
        // If a node does not have a PARENT_NAME, it means it is a top-level node.
        rootNodes.push(nodesById[node.COMPONENT_NAME]);
      }
    });

    return rootNodes; // Each of these nodes may have its own children, creating a hierarchical structure.
  };

  /* If a node has children (node.children), the function calls itself (renderTree(node.children)) to render these child nodes. 
    This function uses recursion to efficiently render a nested tree structure, where each node can have its own children,
    which in turn can have more children, and so on. This recursive call ensures that each child node is also processed and rendered as a TreeItem,
    and if those child nodes have their own children, the process continues recursively. */
  const renderTree = (nodes) =>
    nodes.map((node) => (
      <TreeItem
        key={node.ID}
        nodeId={String(node.ID)}
        label={<span className="treeItemLabel">{node.COMPONENT_NAME}</span>}
      >
        {node.children && renderTree(node.children)}
      </TreeItem>
    ));

  /* This function is for creating a string that represents the full hierarchical path from the selected node back to the root of the tree. */
  const buildFullPath = (selectedNode, allNodes) => {
    // For quick lookup. Map can find any node in the map without having to iterate through the entire tree or entire allNodes array.
    const nodeMap = allNodes.reduce((map, node) => {
      map[node.COMPONENT_NAME] = node;
      return map;
    }, {});

    let path = [selectedNode.COMPONENT_NAME];
    let currentNode = selectedNode;

    // While there is a PARENT_NAME for the current node and it is not the root node.
    while (currentNode && currentNode.PARENT_NAME) {
      // Use PARENT_NAME to find the parent node in the nodeMap.
      const parentNode = nodeMap[currentNode.PARENT_NAME];
      //console.log(`Looking up parent: ${currentNode.PARENT_NAME}`, parentNode);

      if (parentNode) {
        // If a parent node is found, its COMPONENT_NAME is added to the beginning of the path array.
        // This step is crucial as it builds the path from the selected node upwards towards the root.
        path.unshift(parentNode.COMPONENT_NAME);
        currentNode = parentNode; // The currentNode is then updated to be the parent node, effectively moving one level up in the hierarchy.
      } else {
        break;
      }
    }
    return path.join("\\");
  };

  // Ensure that the findNodeById function is working correctly and returns the expected node.
  const findNodeById = (nodes, id) => {
    const queue = [...nodes]; // Start with all nodes

    while (queue.length > 0) {
      const node = queue.shift(); // Dequeue the first node
      if (node.ID === id) {
        return node; // Found the node with the given ID
      }
      if (node.children) {
        queue.push(...node.children); // If the node has children, add them to the queue
      }
    }
    return null; // Return null if no node was found with the given ID
  };

  /* handleNodeSelect function: called when a node in the tree is selected. 
     It should use buildFullPath to compute the full path for the selected node 
     and update the state in the parent component via the onNodeSelect callback. */
  const handleNodeSelect = (event, nodeId) => {
    const numericNodeId = parseInt(nodeId, 10); // Ensure nodeId is a number
    const selectedNode = findNodeById(data, numericNodeId);
    if (selectedNode) {
      // Build the full path for the selected node
      const fullPath = buildFullPath(selectedNode, data);
      // Instead of just passing fullPath, also pass the selectedNode's data
      onNodeSelect(fullPath, selectedNode);
    } else {
      console.error(`Node with id ${nodeId} not found.`);
    }
  };

  // When the data isn't populated.
  if (!isPopulated) {
    return (
      <div className="window-container">
        <p>Please click "Populate Data in Tree" to display the data.</p>
      </div>
    );
  }

  // Check if data is not yet fetched
  if (!data || data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="window-container"
      style={{
        overflowY: "auto",
        maxHeight: "300px",
        padding: "10px",
      }}
    >
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expandedNodes}
        onNodeToggle={(event, nodeIds) => setExpandedNodes(nodeIds)}
        onNodeSelect={handleNodeSelect}
      >
        {renderTree(data)}
      </TreeView>
    </div>
  );
}

export default TreeViewWindow;
