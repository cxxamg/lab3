import { useRef, useEffect} from "react"
import {Canvas} from "../canvas/canvas"
import { getFormValues, validateValues } from "../../js/Validation.js";
import { store } from '../../js/store/store';
import { useStore } from '@tanstack/react-store';
import { userStore } from "../../js/store/userStore.js";

export function MainForm({setPoints}){
    const radiusRef = useRef(null);
    const xRef = useRef(null);
    const yRef = useRef(null);
    const formRef = useRef(null);
    // const count = useStore(store, state => state.count);
    // const points = useStore(store, state => state.points);
    const { count, points } = useStore(store, state => ({ count: state.count, points: state.points }));
    const user = useStore(userStore, state => ({user: state.user}));

    
    useEffect(() => {
        const form = formRef.current;
        if (!form) return;

        handleSubmit;

        form.addEventListener("submit", handleSubmit);
        
    }, []);
    
        const handleSubmit = (e) => {
        console.log("lpo"); 

            e.preventDefault(); // предотвращаем стандартную отправку
            const values = getFormValues(formRef.current);
            if (!validateValues(values)) {
                console.log("Некорректные данные");
                return; // не отправляем форму
            }
            console.log("Форма корректна, отправка возможна");
            const {x, y, r} = values; //деструктуризация
            fetchData(x, y, r);
        };

    const fetchData = async (x, y, r) => {
        console.log("fetch отправка началась");
        try {
        const url =  `/api/points?x=${encodeURIComponent(x)}&y=${encodeURIComponent(y)}&r=${encodeURIComponent(r)}`
            

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // важно! браузер отправит куки
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data, " пришел ответ")
        store.setState(prev => ({...prev, count: prev.count + 1}));
        store.setState(prev => ({...prev, points: [...prev.points, data]})); //создается новый обьект а не мутируется старый
        //setPoints(prev => [...prev, data]); //создается новый массив
        //console.log(count, points);
        } catch (error) {
            store.setState((state) => ({...state, error: error.message})); 
        }
    };



    return(
        <>
    <div className="grid-container">
    <div className="form-container">
        <form ref={formRef} id="main_form">
            <div className="form-group">
                <label htmlFor="x">Введите X координату:</label>
                <input ref={xRef} type="text" id="x" name="x" min="-3" max="5" step="0.0001" required placeholder=" [-3;5]"/>
                
            </div>
           
            <div className="form-group">
                <label htmlFor="y">Введите Y координату:</label>
                <input ref={yRef} type="text" id="y" name="y" min="-3" max="3" step="0.0001" required placeholder=" [-3;3]"/>
            </div>

            
            <div className="form-group">
                <label htmlFor="radius">Выберите радиус (R):</label>
                <input ref={radiusRef} type="text" id="radius" name="radius" min="-3" max="3" step="0.0001" required placeholder=" [-3;3]"/>
            </div>

            
            <button type="submit">Проверить точку</button>
        </form>
    </div>
        <Canvas radiusRef={radiusRef} xRef={xRef} yRef={yRef}/>
    </div>
        </>
    )
}