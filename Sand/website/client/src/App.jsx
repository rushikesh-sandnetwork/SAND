import "./App.css";
import LoginPage from "./pages/globals/LoginPage/LoginPage";
import { Routes, Route, Navigate } from "react-router-dom";
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


import AdminPage from "./pages/users/admin/pages/AdminPage/AdminPage";
import MisPage from "./pages/users/mis/MisPage/MisPage";

const App = () => {
  const { isAuthenticated, user, loading } = useAuth();

  // If loading or not authenticated, render the login page
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={`/admin/${user?._id}`} />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/admin/:id/*"
        element={
          <RequiredAuth>
            <AdminPage />
          </RequiredAuth>
        }
      />
      <Route path="/mis/:id/*" element={<MisPage />} />

      <Route
        path="/admin/createNewForm/:campaignId"
        element={
          <RequiredAuth>
            <AdminCreateForms />
          </RequiredAuth>
        }
      />

      <Route
        path="/admin/createNestedForm/:formId"
        element={
          <RequiredAuth>
            <AdminCreateForms />
          </RequiredAuth>
        }
      />
      <Route
        path="/admin/viewFormData/:formId"
        element={
          <RequiredAuth>
            <AdminFormViewData />
          </RequiredAuth>
        }
      />
      <Route
        path="/admin/assignForm/:formId"
        element={
          <RequiredAuth>
            <AdminAssignCreatedForm />
          </RequiredAuth>
        }
      />
      {/* <Route path="/admin/Ad" */}
      <Route
        path="/admin/acceptData/:formId"
        element={
          <RequiredAuth>
            <AdminAcceptedData />
          </RequiredAuth>
        }
      />
      <Route
        path="/admin/rejectData/:formId"
        element={
          <RequiredAuth>
            <AdminRejectedData />
          </RequiredAuth>
        }
      />
      <Route
        path="/admin/viewPromoters/:formId"
        element={
          <RequiredAuth>
            <AdminAssignCreatedForm />
          </RequiredAuth>
        }
      />
      <Route path="/mis" element={<MisLandingPage />} />
      {/* <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes >


  );
};

export default App;
