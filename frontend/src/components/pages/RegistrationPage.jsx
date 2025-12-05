//import '../styles/App.css'
import {Header} from "../header/Header"
import { useRef, useEffect, useState } from "react";
import { getFormValues, validateValues } from "../../js/loginHandler.js";
import { userStore } from "../../js/store/userStore";

export default function RegistrationPage() {
  const formRef2 = useRef(null);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
          const form = formRef2.current;
          if (!form) return;
  
          const handleSubmit = (e) => {
              console.log("submit"); 
              e.preventDefault(); // предотвращаем стандартную отправку
              const values = getFormValues(formRef2.current);
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
                  const url = '/api/authResponce/reg'; // POST обычно к одному URL
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
                  window.location.href = "/login";
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
      <form ref={formRef2}>

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
        <button type="submit"className="button-link-reg">Зарегестрироваться</button>
        <a href="/login" className="a-link-reg">Вернуться к авторизации</a>
        </div>
      </form>
    </>

  
  )
}