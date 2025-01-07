import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./featurs/auth/Login";
import DashLayout from "./components/dash/DashLayout";
import Welcome from "./featurs/auth/Welcome";
import NotesList from "./featurs/notes/NotesList";
import UsersList from "./featurs/users/UsersList";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />

          <Route path="notes">
            <Route index element={<NotesList />} />
          </Route>

          <Route path="users">
            <Route index element={<UsersList />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
