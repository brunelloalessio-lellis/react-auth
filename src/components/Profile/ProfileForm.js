import classes from "./ProfileForm.module.css";
import { apiKey } from "../../constants";
import { useContext, useRef } from "react";
import AuthContext from "../../store/auth-context";

const ProfileForm = () => {
  const password = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`;
    const enteredPassword = password.current.value;
    //validation

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredPassword,
        returnSecureToken: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Error changing password");
        }
      })
      .then((json) => {
        console.log(json);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" minLength="7" ref={password} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
