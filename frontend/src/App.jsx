import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import VehicleRequestForm from "./Pages/RequestForm/VehicleRequestForm";
import NotificationsPage from "./Pages/Notifications/NotificationsPage";
import Layout from "./Layout";
import CreateAccount from "./Pages/CreateAccount/CreateAccount";
import SetPassword from "./Pages/SetPassword/SetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/VehicleRequestForm" element={<VehicleRequestForm />} />
          <Route path="/Notifications" element={<NotificationsPage />} />
          <Route path="/CreateAccount" element={<CreateAccount />} />
          <Route path="/SetPassword/:email" element={<SetPassword />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
