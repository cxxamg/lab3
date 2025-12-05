export function getFormValues(form) {
    const login = form.login.value;
    const password = form.password.value;
    console.log(`getformValues: ${login} ${password}`)
    return {login, password};
}

export function validateValues({login, password}) {
    if (!login || !password) {
        alert("Все поля должны быть заполнены.");
        return false;
    }

    return true;
}

