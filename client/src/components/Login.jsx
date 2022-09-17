import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../api/axios';
const LOGIN_URL = '/auth';

export default function Login() {

  // const navigate = useNavigate();
  //We created a global state for useContext for our App and here we pull in what we need for our login component.
  const { setAuth, persist, setPersist } = useAuth()
  //Now, if we successfully authenticate when we log in we will set our new Auth state and store it in the global context.

  const navigate = useNavigate();
  const location = useLocation();
  //Get where the user came from or redirect to /
  const from = location.state?.from?.pathname || "/";

  //useRef references. Set the focus on the user input when the component loads.
  //If error we set the focus on it so it can be readed by a screen reader fo accesibility
  const userRef = useRef();
  const errRef = useRef();

  //States
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  // const [success, setSuccess] = useState(false);

  //Use effect hook. Set the focus when the component loads.
  useEffect(() => {
    userRef.current.focus();
  }, [])

  //Error message. If we display it, besides showing it, anytime we set the state of the dependencies in the array, we want to clear the error message, because the user has read the error message and made changes.
  useEffect(() => {
    setErrMsg('');
  }, [user, pwd])

  //Notice that we don't need to pass it from the button, because it is the only one in the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    //If there is no connection to db, just for testing, comment in the next two lines
    // console.log(user, pwd);
    // setUser('');
    // setPwd('');
    // setSuccess(true);
    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ user, pwd, roles, accessToken });
      setUser('');
      setPwd('');
      // setSuccess(true);
      //Replace the success page with:
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }

  }

  const togglePersist = () => {
    setPersist(prev => !prev);
  }

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist])

  return (
    // <div className="app-registration">
    //   {success ? (
    //     <section>
    //       <h1>You are logged in!</h1>
    //       <br />
    //       <p>
    //         <a href="/">Go to Home</a>
    //       </p>
    //     </section>
    //   ) : (
    <section>
      {/* Holds the error if exists. Offscreen is different from display:none, which would remove it from the document. Assertive: When we focus in this element, it will be announced with the screen reader */}
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <button>Sign In</button>
        <div className="persistCheck">
          <input
            type="checkbox"
            id="persist"
            onChange={togglePersist}
            checked={persist}
          />
          <label htmlFor="persist">Trust this device</label>
        </div>
      </form>
      <p>
        Need an Account?<br />
        <span className="line">
          <Link to="/register">Sign Up</Link>
        </span>
      </p>
    </section>

  )
  // }

  // </div>

  //   )
}