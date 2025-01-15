import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useDeleteUserMutation, useUpdateUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const [roles, setRoles] = useState(user.roless);
  const [active, setActive] = useState(user.active);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);

  const onPasswordChanged = (e) => setPassword(e.target.value);

  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectOptions, // HTMLCollection
      (option) => option.value
    );
    setRoles(values);
  };

  const onActiveChanged = () => setActive((prev) => !prev);

  const onSaveUserClicked = async () => {
    if (password) {
      await updateUser({ id: user.id, username, password, roles, active });
    } else {
      await updateUser({ id: user.id, username, roles, active });
    }
  };

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  let canSave;
  if (password) {
    canSave =
      [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
  } else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
  }
  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";

  const validUserClass = !validUsername ? "form__input--incomplete" : "";

  const validPWDClass =
    password && !validPassword ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const validRolesClass = !Boolean(roles.length)
    ? "form__input--incomplete"
    : "";

  return (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="save"
              onClick={onSaveUserClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label htmlFor="username" className="form__lable">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className={`form__input ${validUserClass}`}
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />
        <label htmlFor="password" className="form__lable">
          Password <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>{" "}
        <input
          type="password"
          name="password"
          id="password"
          className={`form__input ${validPWDClass}`}
          value={password}
          onChange={onPasswordChanged}
        />
        <label
          htmlFor="user-active"
          className="form__lable form__checkbox-container"
        >
          ACTIVE:
        </label>
        <input
          type="checkbox"
          name="user-active"
          id="user-active"
          className="form__checkbox"
          checked={active}
          onChange={onActiveChanged}
        />
        <label htmlFor="roles" className="form__lable">
          ASSIGNED ROLES:
        </label>
        <select
          name="roles"
          id="roles"
          className={`form__select ${validRolesClass}`}
          multiple={true}
          size="3"
          value={roles}
          onChange={onRolesChanged}
        >
          {options}
        </select>
      </form>
    </>
  );
};

export default EditUserForm;
