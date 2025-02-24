/*
By Ahmed Al-Ghezi
 */

import React, {Component} from "react";
import './style.css';
import PostSignup from '../DB/postSignup';
import {useNavigate, useSearchParams} from "react-router-dom";
import AlertDialog from "../utli/alertDialog";
import {Alert} from "@mui/material";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";

class ChangePasswordC extends Component {


    constructor(props) {
        super(props);
        this.state = {currentPassword: '', newPassword: '', temp: '', isTemp: false, email: '',
            success:false, error:false, successMsg:"", errorMsg:""};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        const tempPass = this.props.searchParams.get("temp");
        const emailP = this.props.searchParams.get("email");
        const isTemp = tempPass != null && tempPass != "";
        if (isTemp)
            PostSignup.passwordChangeLinkClicked({email: emailP, temp: tempPass}).then(response => {
                if(response.data.res === "wrong_pass")
                    alert("Error: the link is either wrong or expired");

            }).catch(e => {
                console.log(e);
                alert("some error has happened");
            });
        this.setState({temp: tempPass});
        this.setState({isTemp: isTemp});
        this.setState({email: emailP});
        //this.iniReCapcha();

    }


    handleChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if(!this.checkPassword(this.state.newPassword))
            return;
        PostSignup.changePassword(this.state).then(response => {
            if (response.data.res === "error")
                alert("some error has happened");
            if (response.data.res === "wrong" && !this.state.isTemp)
                  window.location.href = window.location.origin+"/reg/sign-in";
            if (response.data.res === "wrong" && this.state.isTemp)
                alert("The link is either wrong or expired");
            if(response.data.res === "wrong_password")
                alert("The current password is not correct");
            if (response.data.res === "ok") {
                this.setState({success:true, successMsg:"password have changed successfully!"});
                //TODO: does not work unless wrpped to the func. comp.
                setTimeout(function(){
                    this.setState({success:false});
                    window.location.href = window.location.origin+"/reg/sign-in";
                }.bind(this),4500);
            }
            if (response.data.res === "wrong_password") {
                alert("current password is not correct");
            }
            if (response.data.res === "expired") {
                alert("The link is either wrong or expired!");
            }
        }).catch(e => {
            console.log(e);
            alert("some error has happened");
        });
    }


    checkPassword = (password) => {
        const passw =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        if (password.match(passw)) return true;
        alert(
            "Das Passwort muss zwischen 8 und 15 Zeichen lang sein und mindestens einen Kleinbuchstaben, " +
            ", einen Großbuchstaben, eine Ziffer und ein Sonderzeichen enthalten."
        );
        return false;
    }




    render() {
        return (
            <div>
                <Alert severity="success" hidden={!this.state.success}>{this.state.successMsg}</Alert>
                <Alert severity="error" hidden={!this.state.error}>{this.state.errorMsg}</Alert>
                <form onSubmit={this.handleSubmit}>
                    <h3>Change Password </h3>
                    <div className="form-group" hidden={this.state.isTemp}>
                        <label>Current password</label>
                        <input type="text" className="form-control" placeholder="Enter password" name="currentPassword"
                               onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label>New password</label>
                        <input type="text" className="form-control" placeholder="Enter password" name="newPassword"
                               onChange={this.handleChange}/>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                    <div>
                        <AlertDialog open={this.state.doneDialog} message={"Password updated successfully!"}
                                     onOk={this.forwardLogin} onCancel={this.cancelDelete}/>
                    </div>
                </form>
                <div className="form-group">
                    <GoogleReCaptchaProvider
                        sitekey="6LcDa3khAAAAAIN_Wm1BS0Kanirc-ldQBJeXvrOz"
                    />


                </div>
            </div>

        );
    }
}

function ChangePassword(props) {
    let navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    return <ChangePasswordC {...props} navigate={navigate} searchParams={searchParams}/>
}

export default ChangePassword;