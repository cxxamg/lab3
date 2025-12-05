import {Table} from "../table/table"
import {Header} from "../header/Header"
import { MainForm } from "../mainForm/mainForm"
import { TestApi } from "../TestApi"
import { useState, useEffect } from "react";
import { store } from '../../js/store/store';
import { useStore, getState } from '@tanstack/react-store';
import { userStore } from "../../js/store/userStore";

export default function MainPage() {
  //const [points, setPoints] = useState([]);  setPoints={setPoints}
  const points = useStore(store, state => state.points);
  const user = useStore(store, state => state.points);

  useEffect(() => {
    const unsubscribe = store.subscribe(state => { //для каждого поля state отдельное сообщение
      console.log('State changed:', state);
    });

    return () => unsubscribe(); // отписка при размонтировании (компонент delete из DOM) (чтобы не дублировались события)
  }, []); // — вызывается только один раз

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      userStore.setState(prev => ({
        ...prev,
        user: savedUser,
        isAuthenticated: true
      }));
    }
    document.cookie = `user=${savedUser}; path=/; SameSite=Lax`; //удалять не нужно тк при перезагрузке заново вход
    localStorage.removeItem("user");
  }, []);

  
  return (
    <>
        <Header />
        <MainForm /> 
        <Table points={points}/>
        <div className="grid-container">
            <a href="/login" className="button-link">logout</a>
        </div>
    </>

  
  )
}