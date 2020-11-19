import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {actions} from 'react-redux-form';

import {postRegistration,loginUser,logoutUser} from '../redux/ActionCreators';

import Home from "./HomeComponent";
import Regsiter from './RegisterComponent';
import Login from './LoginComponent';
import Profile from './ProfileComponent';
import ViewLoans from './ViewLoansComponent';
import Header from "./Header";
import Footer from "./Footer";

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
    postRegistration: (firstname,lastname,email,role,phone,password) => dispatch(postRegistration(firstname,lastname,phone,email,role,password)),
    resetRegistrationForm: () => {dispatch(actions.reset('register'))},
    loginUser : (email,password) => dispatch(loginUser(email,password)),
    logoutUser: () => dispatch(logoutUser())
});

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const HomePage = () => {
      return <Home title={"Welcome To Loan Management System"} />;
    };

    const RegisterPage = () => {
        return <Regsiter 
          postRegistration={this.props.postRegistration} 
          resetRegistrationForm = {this.props.resetRegistrationForm} 
          isLoading = {this.props.user.isLoading}
          userFailed = {this.props.user.errMsg}
          user = {this.props.user.user}
          />
    };

    const ProfilePage = () => {
      return <Profile user={this.props.user.user}
      />;
    }

    const ViewLoansPage = () => {
      return <ViewLoans user={this.props.user.user} />;
    };

    const LoginPage = () => {
      return <Login user={this.props.user.user} 
              loginUser={this.props.loginUser}
              userFailed = {this.props.user.errMsg}  
              isLoading = {this.props.user.isLoading}
      />
    }

    return (
      <div>
        <Header user={this.props.user.user} logoutUser={this.props.logoutUser}/>
        <Switch>
          <Route path="/home" component={HomePage} />
          <Route path='/register' component={RegisterPage} />
          <Route path='/profile' component={ProfilePage} />
          <Route path='/viewloans' component={ViewLoansPage} />
          <Route path='/login' component={LoginPage} />
          <Redirect to="/home" />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));