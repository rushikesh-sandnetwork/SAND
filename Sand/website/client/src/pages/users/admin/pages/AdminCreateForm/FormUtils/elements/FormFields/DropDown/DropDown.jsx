// import React, { useState, useEffect } from 'react';
// import { connect } from 'react-redux';
// import { useDrag } from 'react-dnd';
// import { setFullNameData } from '../actions/fullNameActions';
// import { v4 as uuidv4 } from 'uuid';
// import * as XLSX from 'xlsx'; // Import XLSX library for reading Excel files
// import './DropDown.css';

// const DropDown = ({ fullNameDataList, setFullNameData }) => {
//   const [inputFields, setInputFields] = useState([]);
//   const [dropdownTitle, setDropdownTitle] = useState('');

//   const addInputField = () => {
//     setInputFields([...inputFields, '']);
//   };

//   const handleInputChange = (index, value) => {
//     const newInputFields = [...inputFields];
//     newInputFields[index] = value;
//     setInputFields(newInputFields);
//   };

//   const handleSubmit = () => {
//     console.log('Dropdown Title:', dropdownTitle);
//     console.log('Form Data:', inputFields);

//     let totalFields = inputFields.join(',');

//     console.log('Total Fields:', totalFields);

//     const id = uuidv4(); // Generate a unique ID
//     let finalSubmission = dropdownTitle + "," + totalFields;
//     console.log('Final Submission:', finalSubmission);

//     setFullNameData(id, finalSubmission, 'Drop Down', {"name":["shivam", "falu"], "surname":["nagori","nagori"]});
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert sheet to JSON array

//         const names = jsonData.flat(); // Flatten the array in case of multiple rows
//         setInputFields(names.filter((name) => typeof name === 'string' && name.trim() !== '')); // Filter valid names
//       };
//       reader.readAsArrayBuffer(file);
//     }
//   };

//   const [{ isDragging }, dragRef] = useDrag({
//     type: 'item',
//     item: { id: uuidv4(), type: 'DropDown', text: 'Drop Down' },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   useEffect(() => {
//     console.log('Full Name Data List:', fullNameDataList);
//   }, [fullNameDataList]);

//   return (
//     <div className="dropDown-container" ref={dragRef}>
//       <input
//         type="text"
//         className="dropDown-title"
//         placeholder="Drop Down"
//         value={dropdownTitle}
//         onChange={(e) => setDropdownTitle(e.target.value)}
//       />

//       {inputFields.map((field, index) => (
//         <div key={index} className="input-group">
//           <input
//             type="text"
//             className="dynamic-input"
//             placeholder={`Enter text ${index + 1}`}
//             value={field}
//             onChange={(e) => handleInputChange(index, e.target.value)}
//           />
//         </div>
//       ))}

//       <button onClick={addInputField} className="add-input-btn">
//         Add Input
//       </button>
//       <button onClick={handleSubmit} className="submit-btn">
//         Submit
//       </button>

//       <div className="file-upload">
//         <label htmlFor="fileInput">Upload Excel File:</label>
//         <input
//           type="file"
//           id="fileInput"
//           accept=".xlsx, .xls"
//           onChange={handleFileUpload}
//         />
//       </div>
//     </div>
//   );
// };

// const mapStateToProps = (state) => ({
//   fullNameDataList: state.fullName.fullNameDataList,
// });

// const mapDispatchToProps = {
//   setFullNameData,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(DropDown);

// DropDown.js
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useDrag } from "react-dnd";
import { setFullNameData } from "../actions/fullNameActions";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import "./DropDown.css";

const DropDown = ({ fullNameDataList, setFullNameData }) => {
  const [componentId] = useState(uuidv4());
  const [dropdownData, setDropdownData] = useState({ headers: [], data: {} });
  const [selectedValues, setSelectedValues] = useState({});
  const [dropdownTitle, setDropdownTitle] = useState("");

  // Handle Excel File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 1) {
          const headers = jsonData[0];
          const rows = jsonData.slice(1);

          const hierarchy = rows.reduce((acc, row) => {
            row.forEach((value, index) => {
              const key = index === 0 ? headers[index] : row[index - 1];
              if (!acc[key]) acc[key] = [];
              if (!acc[key].includes(value)) acc[key].push(value);
            });
            return acc;
          }, {});

          setDropdownData({ headers, data: hierarchy });
          setFullNameData(componentId, dropdownTitle, "Drop Down", {
            headers,
            data: hierarchy,
          });
        } else {
          console.error("Invalid Excel file: No data rows found.");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Handle Dropdown Changes
  const handleSelectionChange = (levelIndex, value) => {
    const newSelectedValues = { ...selectedValues, [levelIndex]: value };

    // Clear dependent levels if parent changes
    Object.keys(newSelectedValues)
      .filter((key) => parseInt(key) > levelIndex)
      .forEach((key) => delete newSelectedValues[key]);

    setSelectedValues(newSelectedValues);
  };

  // Render Dropdowns
  const renderDropdowns = () => {
    const { headers, data } = dropdownData;
    if (!headers || !data) return null;

    return headers.map((header, index) => {
      const parentKey = index === 0 ? header : selectedValues[index - 1];
      const options = parentKey ? data[parentKey] || [] : [];

      return (
        <select
          key={index}
          value={selectedValues[index] || ""}
          onChange={(e) => handleSelectionChange(index, e.target.value)}
          disabled={!options.length}
        >
          <option value="">{`Select ${header}`}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    });
  };

  // Save or Update Data
  const onBlurTitle = (event) => {
    const title = event.target.value.trim();
    if (title) {
      setDropdownTitle(title);
      setFullNameData(componentId, title, "Drop Down", dropdownData);
    }
  };

  const [{ isDragging }, dragRef] = useDrag({
    type: "item",
    item: { id: componentId, type: "Drop Down", text: "Drop Down" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    console.log("Full Name Data List:", fullNameDataList);
  }, [fullNameDataList]);

  return (
    <div className="dropDown-container" ref={dragRef}>
      <input
        type="text"
        className="dropDown-title"
        placeholder="Drop Down Title"
        defaultValue={dropdownTitle}
        onBlur={onBlurTitle}
      />

      <div className="dropdown-group">{renderDropdowns()}</div>

      <div className="file-upload">
        <label htmlFor="fileInput">Upload Excel File:</label>
        <input
          type="file"
          id="fileInput"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  fullNameDataList: state.fullName.fullNameDataList,
});

const mapDispatchToProps = {
  setFullNameData,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropDown);