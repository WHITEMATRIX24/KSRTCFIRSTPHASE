import React, { useEffect, useState } from "react";
import "./loginpage.css";
import { loginApiHandler } from "../../services/allAPI";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [loginCrededntials, setLoginCredentials] = useState({
    userName: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [user,setUser] = useState({})
  const navigate = useNavigate();

  //   handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { userName, password } = loginCrededntials;

    if (!password || !userName) {
      return alert("Fill the form completly");
    }

    try {
      const response = await loginApiHandler(loginCrededntials);

      if (response.status != 200) {
        return alert(response.response.data);
      }
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user)
      console.log(user);
      if(response.data.user.role){
      if(response.data.user.role == "Staff")
      {navigate("/fleet", { replace: true });}
      else if(response.data.user.role== "Maintenance")
        {navigate("/maintanance", { replace: true });}
      else 
      {navigate("/dashboard", { replace: true });}}

    } catch (error) {
      console.log(`error in login error: ${error}`);
    }
  };

  useEffect(() => {
    alert("You are opening an untested Beta version");
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="d-flex flex-column gap-4 align-items-center">
        <img
          src="https://play-lh.googleusercontent.com/Hm7mdo5V8AFPY8Vlt86CzlGDbCApcR2kAIek7lYnmRA_x7IXeyhQ6tACqjyXqNe28D8"
          alt=""
          className="h-25 w-25 inline-block"
        />
        <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="depo name"
            className="loginpage-input rounded-3 px-3 py-2"
            value={loginCrededntials.userName}
            onChange={(e) =>
              setLoginCredentials({
                ...loginCrededntials,
                userName: e.target.value,
              })
            }
          />
          <div className="d-flex flex-column align-items-start">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="password"
              className="loginpage-input rounded-3 px-3 py-2"
              value={loginCrededntials.password}
              onChange={(e) =>
                setLoginCredentials({
                  ...loginCrededntials,
                  password: e.target.value,
                })
              }
            />
            <div className="d-flex gap-2 align-items-center mt-2">
              <input
                type="checkbox"
                onChange={() => setPasswordVisible(!passwordVisible)}
              />
              <p className="mb-0">show password</p>
            </div>
          </div>
          <button className="loginpage-btn rounded-3 py-2 mt-4" type="submit">
            login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
