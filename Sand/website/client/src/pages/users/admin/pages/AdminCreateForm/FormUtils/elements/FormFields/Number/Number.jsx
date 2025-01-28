import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDrag } from "react-dnd";
import { setFullNameData } from "../actions/fullNameActions"; // Reuse the existing action
import { v4 as uuidv4 } from "uuid";
import "./Number.css";

const Number = ({ fullNameDataList = [], setFullNameData }) => {
  const [componentId] = useState(uuidv4()); // Unique ID for this instance
  const [numberTitle, setNumberTitle] = useState("Number"); // Local state for the title

  // Handle title change, allow spaces
  const handleTitleChange = (event) => {
    setNumberTitle(event.target.value);
  };

  // Update title on blur (when the user clicks away)
  const handleTitleBlur = () => {
    const titleValue = numberTitle.trim(); // Optional: trim spaces around the title
    if (titleValue) {
      const existingEntry = fullNameDataList.find(
        (entry) => entry.uniqueId === componentId
      );

      if (existingEntry) {
        // Update the existing entry with the new title
        setFullNameData(componentId, titleValue, "Number");
      } else {
        // Create a new entry
        setFullNameData(componentId, titleValue, "Number");
      }
    }
  };

  const [{ isDragging }, dragRef] = useDrag({
    type: "item",
    item: { id: componentId, type: "Number", title: "Number" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    console.log("Full Name Data List:", fullNameDataList);
  }, [fullNameDataList]);

  return (
    <div
      className={`number-container ${isDragging ? "dragging" : ""}`}
      ref={dragRef}
    >
      <input
        type="text"
        className="number-title"
        placeholder="Number"
        name="numberTitle"
        value={numberTitle}
        onChange={handleTitleChange} // Update title on change
        onBlur={handleTitleBlur} // Update on blur
      />
      <input
        type="number"
        className="numberInput"
        name="numberInput"
        placeholder="Enter number..."
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  fullNameDataList: state.fullName.fullNameDataList, // Use the existing state
});

const mapDispatchToProps = {
  setFullNameData, // Reuse the existing action
};

export default connect(mapStateToProps, mapDispatchToProps)(Number);
