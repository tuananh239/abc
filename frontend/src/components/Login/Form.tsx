import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/UserService';
import { useGoogleLogin } from '@react-oauth/google';


const useStyles = createUseStyles({
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        margin: 'auto',
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '100%',
        margin: '0px auto 15px',
        '&:focus': {
            outline: 'none',
            border: '1px solid #4CAF50',
        },
    },
    button: {
        padding: '10px',
        margin: '5px 0',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: '#31304D',
        color: 'white',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        '&:active': {
          transform: 'scale(0.95)',
        },
        '&:hover': {
            backgroundColor: '#161A30',
          },
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        width: '100%',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      },
    googleLogin: {
        color: '#161A30',
        textAlign: 'center',
        textDecoration: 'none',
        '&:hover': {
            color: '#31304D',
          },
        marginTop: '10px',
    },
    forgotPassword: {
        textAlign: 'right',
        color: '#161A30',
      },
    inputError: {
        border: '2px solid red',
      },
    errorBox: {
        border: '1px solid red',
        borderRadius: '5px',
        padding: '5px 10px',
        color: 'red',
        marginBottom: '15px',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
});

interface FormProps {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const Form: React.FC<FormProps> = ({ setIsAuth }) => {
const classes = useStyles();
const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFormatError, setEmailFormatError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(email)) {
      setEmailFormatError('Wprowadź poprawny adres email.');
      return;
    }

    try {
      const response = await loginUser(email, password);

      if (response.success) {
        setIsAuth(true);
        navigate('/home');
      } else {
          const errorMessage = response.message || 'Nieprawidłowy email lub hasło.';
          setLoginError(errorMessage);
      }
    } catch (error) {
      if ((error as Error).message === 'Network Error.6') {
        setLoginError('Brak połączenia. Spróbuj ponownie później.');
      } else {
        setLoginError('Wystąpił błąd podczas weryfikacji danych. Spróbuj ponownie później.');
      }
      console.error('Wystąpił błąd podczas weryfikacji danych.', error);
    } finally {
      setIsLoading(false);
    }
};

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailRegex.test(e.target.value)) {
        setEmailFormatError('Wprowadź poprawny adres email.');
      } else {
        setEmailFormatError('');
      }
  };
  
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${response.access_token}` },
        })
        

        console.log(userInfo)
        setIsAuth(true)
      } catch (error) {
        console.log(error)
        setIsAuth(false)
      }
    }
  });

  return (
      <div className={classes.wrapper}>
          <form onSubmit={handleSubmit} className={classes.form}>
              {loginError && <p className={classes.errorBox}>{loginError}</p>}
              <div className={classes.inputContainer}>
                  <label htmlFor="email">Email</label>
                  <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      className={`${classes.input} ${emailFormatError ? classes.inputError : ''}`}
                  />
                  {emailFormatError && <p>{emailFormatError}</p>}
              </div>
              <div className={classes.inputContainer}>
                  <label htmlFor="password">Hasło</label>
                  <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                      className={classes.input}
                  />
                  <a href="/resetPassword" className={classes.forgotPassword}>Zapomniałeś hasła?</a>
              </div>
              <button type="submit" className={classes.button}>
                {isLoading ? 'Ładowanie...' : 'Zaloguj się'}
              </button>
              <a className={classes.googleLogin} onClick={() => login()}>
                  <FcGoogle size={25} /> Zaloguj za pomocą Google
              </a>
          </form>
      </div>
  );
};

export default Form;