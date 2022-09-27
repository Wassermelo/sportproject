/*
By Ahmed Al-Ghezi
 */

import React, { Component } from "react";
import PostSignup from "../DB/postSignup";
import { Link } from "react-router-dom";
import image from "../images/inprove_logo-400x103.png";
import Footer from "./footer";
import UserService from "../UserService";

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignIn: true,
      showSignUp: true,
      showTrainer: false,
      showAdminTrainer: false,
      showAdmin: false,
      flag: false,
    };
    this.checkLogin = this.checkLogin.bind(this);
  }

  componentDidMount() {
    this.checkLogin();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.loggedin &&
      this.props.loggedin !== prevProps.loggedin &&
      this.state !== prevState
    )
      this.checkLogin();
  }

  checkLogin() {
    PostSignup.isLogin()
      .then((response) => {
        if (response.data.res === "ok") {
          this.setState({ showSignIn: false });
          this.setState({ showSignUp: false });
          this.setState({
            showTrainer: PostSignup.isTrainer(response.data.role),
          });
          this.setState({
            showAdminTrainer: PostSignup.isAdminTrainer(response.data.role),
          });
          this.setState({ showAdmin: PostSignup.isAdmin(response.data.role) });
        } else {
          this.setState({ showSingIn: true });
          this.setState({ showSingUp: true });
        }
        this.props.navBarUpdated();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <a href="https://www.inprove.info/" target="_blank">
            {" "}
            <img className="image" src={image} />
          </a>

          <div className="container">
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li
                  className="nav-item"
                  hidden={!this.state.showSignIn /*|| this.props.loggedin*/}
                >
                  <Link className="nav-link" hidden={UserService.isLoggedIn()} to={"/reg/sign-in"}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" target="_blank"
                     href="http://192.168.2.105:8089/auth/realms/Sport/account/#/personal-info">
                    Profil
                  </a >
                </li>
                <li className="nav-item" hidden={!UserService.isLoggedIn()}>
                  <Link className="nav-link" onClick={() => UserService.doLogout()} to={"/reg/sign-out"}>
                    Sign out
                  </Link>
                </li>

                <li className="nav-item" hidden={UserService.isLoggedIn()}>
                  <Link className="nav-link" to={"/reg/sign-up-van"}>
                    Registrieren
                  </Link>
                </li>

                <li
                  className="nav-item"
                  hidden={!UserService.hasRole('sport_trainer_admin') && !UserService.hasRole('sport_admin')}
               //   hidden={!this.state.showAdminTrainer && !this.state.showAdmin}
                >
                  <Link className="nav-link" to={"/csv/reader"}>
                    Upload Files
                  </Link>
                </li>

                <li
                  className="nav-item"
                  //hidden={!this.state.showAdminTrainer && !this.state.showAdmin}
                  hidden={!UserService.hasRole('sport_trainer_admin') && !UserService.hasRole('sport_admin')}
                >
                  <Link className="nav-link" to={"/lime/control"}>
                    Control Limesurvey
                  </Link>
                </li>

                <li
                  className="nav-item"
                  //hidden={!this.state.showAdminTrainer && !this.state.showAdmin}
                  hidden={!UserService.hasRole('sport_trainer_admin') && !UserService.hasRole('sport_admin')}
                >
                  <Link className="nav-link" to={"/csv/athleteInfo"}>
                    Athletes Info
                  </Link>
                </li>

                <li className="nav-item"
                   // hidden={!this.state.showTrainer}
                    hidden={!UserService.hasRole('sport_trainer')}
                >
                  <Link className="nav-link" to={"/trainer/addMyTests"}>
                    Trainings List
                  </Link>
                </li>
                <li className="nav-item"
                    //hidden={!this.state.showTrainer}
                    hidden={!UserService.hasRole('sport_trainer')}
                >
                  <Link className="nav-link" to={"/trainer/addAthletes"}>
                    Athletes List
                  </Link>
                </li>
                <li className="nav-item"
                    //hidden={!this.state.showTrainer}
                    hidden={!UserService.hasRole('sport_trainer')}
                >
                  <Link className="nav-link" to={"/trainer/sheet"}>
                    Evaluation
                  </Link>
                </li>
                <li className="nav-item"
                    //hidden={!this.state.showAdminTrainer}
                    hidden={!UserService.hasRole('sport_trainer_admin')}
                >
                  <Link className="nav-link" to={"/trainer/createTest"}>
                    Create New Training
                  </Link>
                </li>

                <li className="nav-item"
                    //hidden={!this.state.showAdminTrainer}
                    hidden={!UserService.hasRole('sport_trainer_admin')}>
                  <Link className="nav-link" to={"/trainer/editCoach"}>
                    Edit Coaches
                  </Link>
                </li>

                <li className="nav-item">
                  <a className="btn btn-primary btn-block" target="_blank" href="http://localhost/index.php/admin/index"  >
                    Go to LimeSurvey
                  </a >
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Footer />
      </div>
    );
  }
}
