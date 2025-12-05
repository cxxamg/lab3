import { useEffect, useRef } from 'react';
import { redraw, center, scale, initCanvas, drawPointOnCoordinatePlane } from '../../js/canvas.js';
import { getFormValues, validateValues } from "../../js/Validation.js";
import { store } from '../../js/store/store';
import { useStore } from '@tanstack/react-store';


export function Canvas({radiusRef, xRef, yRef}){
    console.log('Initializing canvas handlers...');
    const canvasRef = useRef(null); //ref={canvasRef}
    const points = useStore(store, state => state.points);

useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lastPoint = points.at(-1);
    const r = lastPoint?.r || parseFloat(radiusRef.current?.value) || 1;

    redraw(canvas, r);

    points.forEach(({ x, y, hit }) => {
        drawPointOnCoordinatePlane(ctx, x, y, hit);
    });

}, [points, radiusRef]);




    //хук для подгрузки canvas в начале 
    useEffect(() => {
        const canvas = canvasRef.current;
        //if (!canvas) return; 

        if (typeof redraw === 'function') {
        console.log('Calling redraw()...');
        redraw(canvas);
        console.log('Redraw completed');
    } else {
        console.error('redraw function is not available!');
    }
    },[]);
    
    

    // обработка клика на график
    useEffect(() => {
        const canvas = canvasRef.current;
        const radiusInput = radiusRef.current;
        const xInput = xRef.current; //значения text
        const yInput = yRef.current;

        //if (!canvas || !radiusInput || !xInput || !yInput) return;

        canvas.addEventListener('click', function(e) {
            console.log('Canvas clicked');
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const r = parseFloat(radiusInput.value);
            
            if (!isNaN(r) && r > 0) {

                const canvasX = x - center;
                const canvasY = center - y; // инвертируем Y
                

                const realX = (canvasX / (scale * r)) * r;
                const realY = (canvasY / (scale * r)) * r;
                
                console.log('Calculated coordinates: x =', realX, 'y =', realY);
                

                xInput.value = realX;
                yInput.value = (realY).toFixed(4);

                // const form = document.getElementById('main_form');
                //     const values = getFormValues(form);
                //     if (validateValues(values)) {
                //         form.submit();
                //     } else {
                //         alert('Некорректные данные, форма не отправлена');
                //     }
            } else {
                alert('Сначала выберите радиус R!');
            }
        });
        //return () => canvas.removeEventListener('click', handleClick);
    }, []);


    //обработка изменений redraw для радиуса
    useEffect(() => {
        const canvas = canvasRef.current;
        const radiusInput = radiusRef.current;
        // if (!canvas || !radiusInput) return;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        function handleInput() {
        console.log(radiusInput.value)
        const r = parseFloat(radiusInput.value);
        if (!isNaN(r) && r > 0 && r < 4) {
            console.log('Radius changed, redraw with R =', r);
            redraw(canvas, r); 
            console.log(points);
            points.forEach(({ x, y, hit }) => {
                drawPointOnCoordinatePlane(ctx, x, y, hit);
            });
            } 
        }
        
        radiusInput.addEventListener("input", handleInput);
        //handleInput();

    },[radiusRef, points]);


    return (<div className="img-container">
        <canvas ref={canvasRef} width="400" height="400"></canvas>
    </div>)
}

