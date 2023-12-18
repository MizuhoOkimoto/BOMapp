// Please replace with your API URL
const apiURL = "https://localhost:44357/api/BOMappAPI";

const APIService = {
  getData: async () => {
    try {
      const response = await fetch(`${apiURL}/GetData`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      //console.log("Fetched data:", data); // Log the data
      return data;
    } catch (error) {
      console.error("Error fetching data", error);
      throw error;
    }
  },
};

export default APIService;
