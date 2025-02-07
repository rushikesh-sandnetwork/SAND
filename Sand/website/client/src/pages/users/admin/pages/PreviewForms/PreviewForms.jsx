import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import TextField from '../components/TextField'; // Example component
import Checkbox from '../components/Checkbox'; // Example component
import React, { useEffect, useState } from "react";
import PageTitle from "../../../../../components/PageTitles/PageTitle";
import "./AdminCreateForms.css";
import DraggableItem from "./FormUtils/elements/DraggableItem";
import DropArea from "./FormUtils/elements/DropArea";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Heading from "./FormUtils/elements/FormFields/Heading/Heading";
import FullName from "./FormUtils/elements/FormFields/FullName/FullName";
import Email from "./FormUtils/elements/FormFields/Email/Email";
import Address from "./FormUtils/elements/FormFields/Address/Address";
import Phone from "./FormUtils/elements/FormFields/Phone/Phone";
import DatePicker from "./FormUtils/elements/FormFields/DatePicker/DatePicker";
import Appointment from "./FormUtils/elements/FormFields/Appointment/Appointment";
import Signature from "./FormUtils/elements/FormFields/Signature/Signature";
import ShortText from "./FormUtils/elements/FormFields/ShortText/ShortText";
import LongText from "./FormUtils/elements/FormFields/LongText/LongText";
import DropDown from "./FormUtils/elements/FormFields/DropDown/DropDown";
import SingleChoice from "./FormUtils/elements/FormFields/SingleChoice/SingleChoice";
import MultipleChoice from "./FormUtils/elements/FormFields/MultipleChoice/MultipleChoice";
import Number from "./FormUtils/elements/FormFields/Number/Number";
import Image from "./FormUtils/elements/FormFields/Image/Image";
import FIleUpload from "./FormUtils/elements/FormFields/FileUpload/FIleUpload";
import StarRating from "./FormUtils/elements/FormFields/StarRating/StarRating";
import ScaleRating from "./FormUtils/elements/FormFields/ScaleRating/ScaleRating";
import Table from "./FormUtils/elements/FormFields/Table/Table";
import { useParams } from "react-router-dom";
import NormalDropDown from "./FormUtils/elements/FormFields/NormalDropDown/NormalDropDown";

const { formId } = useParams();

const dragItems = [
  { id: "1", text: "Heading", component: Heading, title: "" },
  { id: "2", text: "Full Name", component: FullName, title: "" },
  { id: "3", text: "Email", component: Email, title: "" },
  { id: "4", text: "Address", component: Address, title: "" },
  // { id: "5", text: "Phone", component: Phone, title: "" },
  { id: "6", text: "Date Picker", component: DatePicker, title: "" },
  // { id: "7", text: "Appointment", component: Appointment, title: "" },
  { id: "8", text: "Short Text", component: ShortText, title: "" },
  { id: "9", text: "Long Text", component: LongText, title: "" },
  { id: "10", text: "Drop Down", component: DropDown, title: "" },
  { id: "11", text: "Normal Drop Down", component: NormalDropDown, title: "" },
  { id: "12", text: "Single Choice", component: SingleChoice, title: "" },
  { id: "13", text: "Multiple Choice", component: MultipleChoice, title: "" },
  { id: "14", text: "Number", component: Number, title: "" },
  { id: "15", text: "Image", component: Image, title: "" },
  { id: "16", text: "File Upload", component: FIleUpload, title: "" },
  { id: "17", text: "Star Rating", component: StarRating, title: "" },
  { id: "18", text: "Scale Rating", component: ScaleRating, title: "" },
  { id: "19", text: "Table", component: Table, title: "" },
];

const componentMap = {
  textField: TextField,
  checkbox: Checkbox,
  singleChoice: SingleChoice,
  multipleChoice: MultipleChoice,
  number: Number,
  image: Image,
  fileUpload: FileUpload,
  starRating: StarRating,
  scaleRating: ScaleRating,
  table: Table,
};

const FormPreview = ({ fullNameDataList }) => {
  const { formId } = useParams();
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    // Fetch form data using formId
    const fetchFormData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/promoter/fetchFormField`,
          { formId }
        );
        const data = await response.json();
        setFormData(data); 
        console.log(data);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchFormData();
  }, [formId]);

  const compareData = () => {
    return formData.map((field) => {
      const draggableItem = draggableItems.find(item => item.id === field.id);
      if (draggableItem) {
        const Component = componentMap[field.type];
        return Component ? (
          <Component key={field.uniqueId} {...field} />
        ) : (
          <div key={field.uniqueId}>Unknown component type: {field.type}</div>
        );
      } else {
        return <div key={field.uniqueId}>No matching draggable item for {field.type}</div>;
      }
    });
  };

  return (
    <div>
      <h1>Form Preview</h1>
      {compareData()}
    </div>
  );
};

const mapStateToProps = (state) => ({
  fullNameDataList: state.fullName.fullNameDataList,
});

export default connect(mapStateToProps)(FormPreview);