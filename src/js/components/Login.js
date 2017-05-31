import { db } from 'baqend/realtime'
import MoviesTab from './tabs/MoviesTab'

const loginButton = '<button type="button" class="btn btn-info btn-default btn-account" data-toggle="modal" data-target="#login-modal">Login</button>'
const logoutButton = '<button type="button" class="btn btn-info btn-danger btn-account" id="button-logout">Logout</button>'

class Login {
    init() {
        if (db.User.me) {
            this.enableLogout();
        } else {
            this.enableLogin();
        }
        $(document).on('click', "#button-register", this.register);
        $(document).on('click', "#button-login", this.login);
        $(document).on('click', "#button-logout", this.logout);

    }

    enableLogin() {
        $("#login-container").html(loginButton);
    }

    enableLogout() {
        $("#login-container").html(logoutButton);
    }

    onLogin() {
      login.enableLogout()
      MoviesTab.update(true)
    }

    onLogout() {
      login.enableLogin()
      MoviesTab.update(true)
    }

    register() {
        //TODO
        let username = $("#username").val();
        let pw = $("#password").val();
        alert("Registration not implemented, yet!");
    }

    login() {
        //TODO
        let username = $("#username").val();
        let pw = $("#password").val();
        alert("Login not implemented, yet!");
    }

    logout() {
        alert("Logout not implemented, yet!");
    }
}

const login = new Login()

export default login
