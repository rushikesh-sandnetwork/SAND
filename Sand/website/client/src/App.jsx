import "./App.css";
import LoginPage from "./pages/globals/LoginPage/LoginPage";
// In your React app's entry file (e.g., App.js)
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import AdminLandingPage from "./pages/users/admin/pages/AdminLandingPage/AdminLandingPage";
import AdminCreateForms from "./pages/users/admin/pages/AdminCreateForm/AdminCreateForms";
import MisLandingPage from "./pages/users/mis/MisLandingPage/MisLandingPage";
import AdminAssignCreatedForm from "./pages/users/admin/pages/AdminAssignCreatedForm/AdminAssignCreatedForm";
import AdminFormViewData from "./pages/users/admin/pages/AdminFormViewData/AdminFormViewData";
import AdminAcceptedData from "./pages/users/admin/pages/AdminAcceptedData/AdminAcceptedData";
import AdminRejectedData from "./pages/users/admin/pages/AdminRejectedData/AdminRejectedData";
import RequiredAuth from "./components/RequiredAuth/RequiredAuth";
import { useAuth } from "./context/AuthContext";
import AdminPage from './pages/users/admin/pages/AdminPage/AdminPage';
import MisPage from './pages/users/mis/MisPage/MisPage';
import AssignCampaignToMis from "./pages/users/admin/pages/AssignCampaignToMis/AssignCampaignToMis";
import ManagerPage from "./pages/users/manager/ManagerPage/ManagerPage";
import AssignClientToManager from "./pages/users/admin/pages/AssignClientToManager/AssignClientToManager";
import PreviewForms from "./pages/users/admin/pages/PreviewForms/PreviewForms";



const App = () => {
  const { isAuthenticated, user, loading } = useAuth();


  // If loading or not authenticated, render the login page
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    // <Router>
    <Routes>
      <Route
        path="/"
        element={
          <LoginPage />
        }
      />
      <Route
        path="/admin/:id/*"
        element={
          <AdminPage />
        }
      />
      <Route
        path="/mis/:id/*"
        element={
          <MisPage />
        }
      />
      <Route
        path="/manager/:id/*"
        element={
          <ManagerPage />
        }
      />


      <Route
        path="/admin/createNewForm/:campaignId"
        element={
          <RequiredAuth>
            <AdminCreateForms />
          </RequiredAuth>
        }
      />

      <Route path="/admin/previewForms/:formId" element={<PreviewForms></PreviewForms>}></Route>

      <Route
        path="/admin/createNestedForm/:formId"
        element={<AdminCreateForms />}
      />
      <Route
        path="/admin/viewFormData/:formId"
        element={<AdminFormViewData />}
      />
      <Route
        path="/admin/assignForm/:formId"
        element={<AdminAssignCreatedForm />}
      />
      <Route
        path="/admin/assignCampaignToMis/:campaignId"
        element={<AssignCampaignToMis />}
      />
      <Route
        path="/admin/assignClientToManager/:clientId"
        element={<AssignClientToManager />}
      />




      {/* <Route path="/admin/Ad" */}
      <Route path="/admin/acceptData/:formId" element={<AdminAcceptedData />} />
      <Route path="/admin/rejectData/:formId" element={<AdminRejectedData />} />
      <Route
        path="/admin/viewPromoters/:formId"
        element={<AdminAssignCreatedForm />}
      />
      <Route path="/mis" element={<MisLandingPage />} />
      {/* <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes >
    // </Router>


  );
};


export default App;
