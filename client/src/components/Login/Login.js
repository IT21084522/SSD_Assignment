import React, { useState } from "react";
import axios from "axios";
import "./Login.scss";
import { getBaseURL } from "../apiConfig";
import TokenRefresher from "../Utils/token"; 
import Cookies from 'js-cookie';

function Login(props) {
  let [uname, setUname] = useState("");
  let [password, setPass] = useState("");
  let [error, setError] = useState("");

  // Adding click handler
  function handleClick() {
    if (validateInputs()) {
      const user = {
        email: uname,
        password: password,
      };
      let url = `${getBaseURL()}api/users/login`;
      axios
        .post(url, { ...user })
        .then((res) => {
          console.log(res);
          if (res.data.length > 0) {
            console.log("Logged in successfully");
            sessionStorage.setItem("isUserAuthenticated", true);
            const user = res.data[0].isAdmin;
            sessionStorage.setItem("customerId", res.data[0].userId);
            sessionStorage.setItem("isAdmin", user ? true : false);

            Cookies.set("jwt_token", res.data[0].token, { secure: true });
            Cookies.set("jwt_refresh_token", res.data[0].refreshToken, { secure: true }); 

            TokenRefresher(res.data[0].refreshToken);
            props.setUserAuthenticatedStatus(user ? true : false, res.data[0].userId);
          } else {
            console.log("An error occurred. Please try again later.");
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("error");
        });
    }
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validatePassword(password) {
    return password.length >= 6;
  }

  function validateInputs() {
    if (!validateEmail(uname)) {
      setError("Please provide a valid email address.");
      return false;
    } else if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    return true;
  }

  function changeName(event) {
    setUname(event.target.value);
  }

  function changePass(event) {
    setPass(event.target.value);
  }

  return (
    <>
      <div className="login-container">
        <h1>Login</h1>
        <div>
          <label>E-Mail</label>
          <input type="text" value={uname} onChange={changeName}></input>
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={changePass}
          ></input>
        </div>
        {error && <div className="error-message">{error}</div>}
        <button onClick={handleClick}>Login</button>
        <div className="register-link" onClick={() => props.navigateToRegisterPage()}>
          Is New User
        </div>
      </div>
    </>
  );
}

export default Login;
