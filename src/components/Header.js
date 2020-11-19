import React, { Component } from 'react';
import { Nav, Navbar, NavbarBrand, NavbarToggler, Collapse, NavItem, Button} from 'reactstrap';
import { NavLink } from 'react-router-dom';

function NavElement ({url,user,name,classes}) {
  if (user) {
    return (
      <NavItem>
        <NavLink className="nav-link"  to={url}><span className={classes}></span> {name}</NavLink>
      </NavItem>
    );
  } else {
    return ( 
      <React.Fragment>
      </React.Fragment>
    );  
  }
}

function LogoutButton({user,fun}) {
  if (user) {
    return (
      <NavItem>
        <Button onClick={fun}><span className="fa fa-sign-out fa-lg"></span>Logout</Button>
      </NavItem>
    );
  } else {
    return (
      <React.Fragment></React.Fragment>
    );
  }
}

class Header extends Component {

  constructor(props) {
       super(props);

       this.toggleNav = this.toggleNav.bind(this);

       this.state = {
         isNavOpen: false       
       };
  }

  toggleNav() {
      this.setState({
        isNavOpen: !this.state.isNavOpen
      });
  }

  render() {
    return(
    <React.Fragment>
      <Navbar dark expand="md">
         <NavbarToggler onClick={this.toggleNav} />
        <div className="container">
            <NavbarBrand   className="mr-auto" href="/">
              <h4>LMS</h4>   
            </NavbarBrand>
            <Collapse isOpen={this.state.isNavOpen} navbar>
              <Nav navbar>
                <NavItem>
                  <NavLink className="nav-link"  to='/home'><span className="fa fa-home fa-lg"></span> Home</NavLink>
                </NavItem>
                <NavElement url={'/register'} user={this.props.user === null} classes={"fa fa-user-plus fa-lg"} name={"Sign Up"}/>
                <NavElement url={'/profile'} user={this.props.user !== null} classes={"fa fa-user fa-lg"} name={"Profile"}/>
                <NavElement url={'/viewloans'} user={this.props.user !== null} classes={"fa fa-money fa-lg"} name={"View Loans"}/>
              </Nav>
              <Nav className="ml-auto" navbar>
                <NavElement url={'/login'} user={this.props.user === null} classes={"fa fa-sign-in fa-lg"} name={"Login"}/>
                <LogoutButton user={this.props.user !== null} fun={this.props.logoutUser} />
              </Nav>
            </Collapse>
        </div>
      </Navbar>
    </React.Fragment>
    );
  }
}

export default Header;