import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useDrag } from "react-dnd";
import { setFullNameData } from "../actions/fullNameActions";
import { v4 as uuidv4 } from "uuid";
import "./NormalDropDown.css";

const NormalDropDown = ({ fullNameDataList, setFullNameData }) => {
  const [inputFields, setInputFields] = useState([]);
  const [dropdownTitle, setDropdownTitle] = useState("Drop Down");
  const [dropdownId, setDropdownId] = useState(uuidv4()); // Persistent unique ID

  useEffect(() => {
    // Check if the dropdown with the current ID exists in the Redux store
    const existingDropdown = fullNameDataList.find(
      (item) => item.uniqueId === dropdownId
    );

    if (existingDropdown) {
      const [title, ...options] = existingDropdown.title.split(",");
      setDropdownTitle(title || "Drop Down");
      setInputFields(options || []);
    }
  }, [fullNameDataList, dropdownId]);

  const addInputField = () => {
    setInputFields([...inputFields, ""]);
  };

  const removeInputField = (index) => {
    const updatedFields = inputFields.filter((_, idx) => idx !== index);
    setInputFields(updatedFields);
  };

  const handleInputChange = (index, value) => {
    const newInputFields = [...inputFields];
    newInputFields[index] = value;
    setInputFields(newInputFields);
  };

  const handleSubmit = () => {
    // Filter out empty options
    const filteredOptions = inputFields.filter((field) => field.trim() !== "");

    if (!dropdownTitle.trim() || filteredOptions.length === 0) {
      alert("Please provide a valid title and at least one option.");
      return;
    }

    // Combine title and options into a single string
    const finalSubmission = `${dropdownTitle},${filteredOptions.join(",")}`;

    // Dispatch updated data to Redux
    setFullNameData(dropdownId, finalSubmission, "NormalDropDown");
    console.log("Dropdown submitted:", { dropdownId, finalSubmission });
  };

  const [{ isDragging }, dragRef] = useDrag({
    type: "item",
    item: { id: dropdownId, type: "NormalDropDown", text: "Drop Down" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div className="dropDown-container" ref={dragRef}>
      <input
        type="text"
        className="dropDown-title"
        placeholder="Dropdown Title"
        value={dropdownTitle}
        onChange={(e) => setDropdownTitle(e.target.value)}
      />

      {inputFields.map((field, index) => (
        <div key={index} className="input-group">
          <input
            type="text"
            className="dynamic-input"
            placeholder={`Option ${index + 1}`}
            value={field}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
          <button
            className="remove-btn"
            onClick={() => removeInputField(index)}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="button-group">
        <button onClick={addInputField} className="add-input-btn">
          Add Option
        </button>
        <button onClick={handleSubmit} className="submit-btn">
          Submit
        </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(NormalDropDown);
