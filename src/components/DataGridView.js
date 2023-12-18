import { useEffect, useState } from "react";
import "./DataGridView.css";
import APIService from "../services/APIService";

function DataGridView({ selectedNodeData }) {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filterData = async () => {
      if (selectedNodeData) {
        try {
          const allData = await APIService.getData();
          // Check if the selectedNodeData.COMPONENT_NAME exists as a PARENT_NAME
          const isParent = allData.some(
            (item) => item.PARENT_NAME === selectedNodeData.COMPONENT_NAME
          );
          let relevantData;
          if (isParent) {
            // If it's a parent, include rows where the PARENT_NAME is the selected node's COMPONENT_NAME
            // but exclude the row where COMPONENT_NAME is the selected node's COMPONENT_NAME
            relevantData = allData.filter(
              (item) =>
                item.PARENT_NAME === selectedNodeData.COMPONENT_NAME &&
                item.COMPONENT_NAME !== selectedNodeData.COMPONENT_NAME
            );
          } else {
            // If it's not a parent, only show the selected node's data
            relevantData = allData.filter(
              (item) => item.COMPONENT_NAME === selectedNodeData.COMPONENT_NAME
            );
          }
          setFilteredData(relevantData);
        } catch (error) {
          console.error("Error filtering data: ", error);
        }
      } else {
        // Clear the data if no node is selected
        setFilteredData([]);
      }
    };
    filterData();
  }, [selectedNodeData]);

  if (selectedNodeData == null) {
    return (
      <div className="datagridview-container_blank">
        <p>Select a part from the tree to view its details.</p>
      </div>
    );
  }
  return (
    <div className="datagridview-container">
      <table>
        <thead>
          <tr>
            <th>PARENT_NAME</th>
            <th>COMPONENT_NAME</th>
            <th>PART_NUMBER</th>
            <th>TITLE</th>
            <th>QUANTITY</th>
            <th>TYPE</th>
            <th>ITEM</th>
            <th>MATERIAL</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.PARENT_NAME}</td>
              <td>{item.COMPONENT_NAME}</td>
              <td>{item.PART_NUMBER}</td>
              <td>{item.TITLE}</td>
              <td>{item.QUANTITY}</td>
              <td>{item.TYPE}</td>
              <td>{item.ITEM}</td>
              <td>{item.MATERIAL}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataGridView;
