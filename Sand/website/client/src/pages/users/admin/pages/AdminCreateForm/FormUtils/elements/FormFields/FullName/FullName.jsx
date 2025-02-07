import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useDrag } from "react-dnd";
import "./FullName.css";
import { setFullNameData } from "../actions/fullNameActions";
import { v4 as uuidv4 } from "uuid";

const FullName = ({ fullNameDataList, setFullNameData, formField }) => {
  const [componentId] = useState(uuidv4());

  const handleBlur = (event) => {
    const inputValue = event.target.value.trim();

    if (inputValue) {
      const existingEntry = fullNameDataList.find(
        (entry) => entry.uniqueId === componentId
      );

      if (existingEntry) {
        setFullNameData(existingEntry.uniqueId, inputValue, "Full Name");
      } else {
        setFullNameData(componentId, inputValue, "Full Name");
      }
    }
  };

  const [{ isDragging }, dragRef] = useDrag({
    type: "item",
    item: { id: componentId, type: "Full Name", text: "Full Name" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    console.log("Full Name Data List:", fullNameDataList);
  }, [fullNameDataList]);

  return (
    <div className="fullName-container" ref={dragRef}>
      <input
        type="text"
        className="fullName-title"
        placeholder={formField?.title || "Full Name"} // Use formField.title if available
        onBlur={handleBlur}
      />
      <div className="form-inputs">
        <div className="firstName">
          <input type="text" className="firstName-input" />
          <input
            type="text"
            className="firstName-title"
            placeholder="First Name"
          />
        </div>
        <div className="lastName">
          <input type="text" className="lastName-input" />
          <input
            type="text"
            className="lastName-title"
            placeholder="Last Name"
          />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(FullName);
