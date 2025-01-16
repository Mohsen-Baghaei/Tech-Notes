import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./featurs/auth/Login";
import DashLayout from "./components/dash/DashLayout";
import Welcome from "./featurs/auth/Welcome";
import NotesList from "./featurs/notes/NotesList";
import UsersList from "./featurs/users/UsersList";
import EditNote from "./featurs/notes/EditNote";
import NewNote from "./featurs/notes/NewNote";
import EditUser from "./featurs/users/EditUser";
import NewUserForm from "./featurs/users/NewUserForm";
import PreFetch from "./featurs/auth/PreFetch";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />

        <Route path="login" element={<Login />} />

        <Route element={<PreFetch />}>
          <Route path="dash" element={<DashLayout />}>
            <Route index element={<Welcome />} />

            <Route path="notes">
              <Route index element={<NotesList />} />
              <Route path=":id" element={<EditNote />} />
              <Route path="new" element={<NewNote />} />
            </Route>

            <Route path="users">
              <Route index element={<UsersList />} />
              <Route path=":id" element={<EditUser />} />
              <Route path="new" element={<NewUserForm />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
