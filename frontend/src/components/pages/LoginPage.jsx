//import '../styles/App.css'
import {Header} from "../header/Header"
import { useRef, useEffect, useState } from "react";
import { getFormValues, validateValues } from "../../js/loginHandler.js";
import { userStore } from "../../js/store/userStore";
import { useStore } from '@tanstack/react-store';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const formRef1 = useRef(null);
  const user = useStore(userStore, state => state.user);
  const isAuthenticated = useStore(userStore, state => state.isAuthenticated);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);



  useEffect(() => {
          const form = formRef1.current;
          if (!form) return;
  
          const handleSubmit = (e) => {
              console.log("submit"); 
              e.preventDefault(); // предотвращаем стандартную отправку
              const values = getFormValues(formRef1.current);
              if (!validateValues(values)) {
                  console.log("Некорректные данные");
                  return; // не отправляем форму
              }
              console.log("Форма корректна, отправка возможна");
              const {login, password} = values; //деструктуризация
              fetchData(login, password);
  
          };
  
          form.addEventListener("submit", handleSubmit);
          
      }, []);

      const fetchData = async (login, password) => {
              console.log(`fetch отправка login началась:  ${login} + ${password}`);
              try {
                  const url = '/api/authResponce/auth'; // POST обычно к одному URL
                  const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json', // говорим серверу, что тело JSON
                    },
                    body: JSON.stringify({ login: login,  password: password}) // данные, которые отправляем
                  });

                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }

                  const data = await response.json();
      
           
              console.log(data, " пришел ответ")
              if (data.status){
                  setVisible(!data.status);
                  userStore.setState(prev => ({
                    ...prev,
                    user: login,
                    isAuthenticated: true
                  }));
                  localStorage.setItem("user", login);

                  //console.log("isAuthenticated внутри компонента:", isAuthenticated);

                  navigate("/main");
              } else {
                  setMessage(data.msg);
                  setVisible(!data.status);
              }
              // userStore.setState(prev => ({...prev, count: prev.count + 1}));
              // userStore.setState(prev => ({...prev, points: [...prev.points, data]})); //создается новый обьект а не мутируется старый
              //setPoints(prev => [...prev, data]); //создается новый массив
              //console.log(count, points);
              } catch (error) {
                  userStore.setState((state) => ({...state, error: error.message})); 
              }
          };


  return (
    <>
        <Header />
      <form ref={formRef1}>

        <div className="login-group">
                <label htmlFor="login">Логин</label>
                <input type="text" id="login" />
            </div>

        <div className="login-group">
                <label htmlFor="password">Пароль</label>
                <input type="password" id="password" />
          </div>

        <div className="login-group">
          {visible && (
                <label style={{color:"red"}}>{message}</label>
          )}
          </div>
        <div className="grid-container">
          <button type="submit"className="button-link">Войти</button>
          <a href="/registration" className="button-link">Регистрация</a>
        </div>
      </form>
    </>

  
  )
}