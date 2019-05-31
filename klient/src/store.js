import { BehaviorSubject } from "rxjs";

// skapa en store för tokens
export const login$ =
    new BehaviorSubject(window.localStorage.getItem('login') || null);
// då token sparas och laddas från localStorage

export function updateLogin(newLogin) {

    if (!newLogin) { // om är null
        window.localStorage.removeItem('login'); // udvika auto logain igen
    } else {
        //  uppdatera token när användaren loggar in
        window.localStorage.setItem('login', newLogin);
    }

    //  uppdatera tokens värde
    login$.next(newLogin);
}