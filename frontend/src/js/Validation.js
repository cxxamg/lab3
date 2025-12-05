export function getFormValues(form) {
    const x = parseFloat(form.x.value.replace(',', '.'));
    const y = parseFloat(form.y.value.replace(',', '.'));
    const r = parseFloat(form.radius.value.replace(',', '.'));
    return { x, y, r };
}

export function validateValues({ x, y, r}) {
    const useX = x;

    if (isNaN(useX) || isNaN(y) || isNaN(r)) {
        alert("Все поля должны быть заполнены корректными числами.");
        return false;
    }

    if (useX < -3 || useX > 3) {
        alert("X должен быть в диапазоне от -3 до 3.");
        return false;
    }

    if (y < -3 || y > 5) {
        alert("Y должен быть в диапазоне от -3 до 5.");
        return false;
    }

    if (r < 1 || r > 3) {
        alert("R (радиус) должен быть в диапазоне от 1 до 3.");
        return false;
    }

    return true;
}