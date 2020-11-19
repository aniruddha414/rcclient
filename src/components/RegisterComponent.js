import React , {Component} from 'react';
import {Card,CardTitle,CardBody,Label,Button,Row,Col} from 'reactstrap';
import { Control, Form, Errors } from 'react-redux-form';
import {withRouter} from 'react-router-dom';

import Error from './ErrorComponent';
import Loader from './LoadingComponent';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
const isNumber = (val) => !isNaN(Number(val));
const lengthIsTen = (val) => val && val.length === 10;
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);
const validPass = (val) => /^[A-Za-z]\w{8,14}$/.test(val);

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillUnmount() {
        if(this.props.user !== null) {
            this.props.history.push('/profile');
        }
    }

    handleSubmit(values) {
        // console.log('Current State is: ' + JSON.stringify(values));
        // console.log('form  data');
        // console.log(values);
        this.props.postRegistration(values.firstname,
            values.lastname,
            values.email,
            values.role,
            values.phoneno,
            values.password
            );
        if (this.props.userFailed === '') {
            console.log('resetting form');
            this.props.resetRegistrationForm();
        }
        this.props.history.push('/profile');
    }

    render () {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="row row-content p-4" style={{width:"90%",marginLeft:"auto",marginRight:"auto"}}>
                        <div className="col-12 col-lg text-center">
                            <Card>
                                <CardBody>
                                    <Error message={this.props.userFailed} />
                                    <CardTitle>
                                        <h4>Register</h4>
                                        <h5>Simplify your loan approval process</h5>
                                    </CardTitle>
                                        <Form model="register" 
                                            validators={{
                                                '': {
                                                  passwordsMatch: (vals) => vals.password === vals.cpassword,
                                                },
                                              }}
                                            onSubmit={(values) => this.handleSubmit(values)}
                                            >
                                            <Row className="form-group">
                                                <Label htmlFor="firstname" md={3}>First Name</Label>
                                                <Col md={9}>
                                                <Control.text model=".firstname" id="firstname" name="firstname"
                                                    placeholder="First Name"
                                                    className="form-control"
                                                    validators={{
                                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                                        }}
                                                    />
                                                    <Errors
                                                            className="text-danger"
                                                            model=".firstname"
                                                            show="touched"
                                                            messages={{
                                                                required: 'Required',
                                                                minLength: 'Must be greater than 2 characters',
                                                                maxLength: 'Must be 15 characters or less'
                                                            }}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="form-group">
                                                <Label htmlFor="lastname" md={3}>Last Name</Label>
                                                <Col md={9}>
                                                <Control.text model=".lastname" id="lastname" name="lastname"
                                                        placeholder="Last Name"
                                                        className="form-control"
                                                        validators={{
                                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                                        }}
                                                        />
                                                        <Errors
                                                            className="text-danger"
                                                            model=".lastname"
                                                            show="touched"
                                                            messages={{
                                                                required: 'Required',
                                                                minLength: 'Must be greater than 2 characters',
                                                                maxLength: 'Must be 15 characters or less'
                                                            }}
                                                            />
                                                </Col>
                                            </Row>
                                            <Row className="form-group">
                                                <Label htmlFor="phoneno" md={3}>Phone No.</Label>
                                                    <Col md={9}>
                                                        <Control.text model=".phoneno" id="phoneno" name="phoneno"
                                                            placeholder="Phone Number"
                                                            className="form-control"
                                                            validators={{
                                                                    required,lengthIsTen,isNumber
                                                                }}
                                                            />
                                                            <Errors
                                                                    className="text-danger"
                                                                    model=".phoneno"
                                                                    show="touched"
                                                                    messages={{
                                                                        required: 'Required',
                                                                        lengthIsTen: 'Phone no. must of 10 digits',
                                                                        isNumber: 'Must be a number'
                                                                    }}
                                                                />
                                                    </Col>
                                            </Row>
                                            <Row className="form-group">
                                                <Label htmlFor="email" md={3}>Email</Label>
                                                <Col md={9}>
                                                <Control.text model=".email" id="email" name="email"
                                                    placeholder="Email"
                                                    className="form-control"
                                                    validators={{
                                                            required,validEmail
                                                        }}
                                                    />
                                                    <Errors
                                                            className="text-danger"
                                                            model=".email"
                                                            show="touched"
                                                            messages={{
                                                                required: 'Required',
                                                                validEmail: 'invalid email'
                                                            }}
                                                        />
                                                </Col>
                                            </Row>
                                            <Row className="form-group">
                                                <Label htmlFor="role" md={3}>Role</Label>
                                                <Col md={9}>
                                                <Control.select model=".role" id="role" name="role"
                                                    placeholder="Applying"
                                                    className="form-control"
                                                >
                                                    <option value="customer" selected>Customer</option>
                                                    <option value="agent">Agent</option>
                                                </Control.select>
                                                </Col>
                                            </Row>
                                            <Row className="form-group">
                                                <Label htmlFor="password" md={3}>Password</Label>
                                                <Col md={9}>
                                                <Control type="password" model=".password" id="password" name="firstname"
                                                    placeholder="Password"
                                                    className="form-control"
                                                    validators={{
                                                            required,validPass
                                                        }}
                                                    />
                                                    <Errors
                                                            className="text-danger"
                                                            model=".password"
                                                            show="touched"
                                                            messages={{
                                                                required: 'Required',
                                                                validPass: 'Password must be between 8 to 14 which contain only characters, numeric digits, underscore and first character must be a letter '
                                                            }}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="form-group">
                                                <Label htmlFor="cpassword" md={3}>Confirm Password</Label>
                                                <Col md={9}>
                                                <Control type="password" model=".cpassword" id="cpassword" name="cpassword"
                                                    placeholder="Confirm Password"
                                                    className="form-control"
                                                    />
                                                    <Errors
                                                            className="text-danger"
                                                            model="register"
                                                            show="touched"
                                                            messages={{
                                                                passwordsMatch: 'Passwords do not match.'
                                                            }}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="form-group">
                                                <Col md={{size: 10, offset: 2}}>
                                                    <Button type="submit" color="primary">
                                                        Submit
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                        <Loader size={40} loading={this.props.isLoading} />                      
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(Register);