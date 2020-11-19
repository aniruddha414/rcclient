import React,{Component} from 'react';
import { withRouter } from 'react-router-dom';
import { Card,CardBody,Label,Form,FormGroup,Input,Button } from 'reactstrap';

import Error from './ErrorComponent';
import Loader from './LoadingComponent';

class Login extends Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
    }

    componentWillMount() {
        if(this.props.user !== null) {
            this.props.history.push('/profile');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        this.props.loginUser(this.email.value,this.password.value);
        if (this.props.user !== null) {
            this.props.history.push('/profile');
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="row row-content p-4" style={{width:"90%",marginLeft:"auto",marginRight:"auto"}}>
                        <div className="col-12 col-lg">
                            <div className="text-center">
                                <h2>Making easy Loan Approval process !!</h2>
                            </div>
                            <div className="text-justified">
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                    It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                </p>
                            </div>
                            <div className="text-center">
                                <Card>
                                    <CardBody>
                                        <h4>Login in LMS</h4>
                                        <Error message={this.props.userFailed}/>
                                        <Form onSubmit={this.handleLogin}>
                                            <FormGroup>
                                                <Label htmlFor="email">Email</Label>
                                                <Input type="email" id="email" name="email"
                                                    innerRef={(input) => this.email = input} />
                                            </FormGroup>

                                            <FormGroup>
                                                <Label htmlFor="password">Password</Label>
                                                <Input type="password" id="password" name="password"
                                                    innerRef={(input) => this.password = input}  />
                                            </FormGroup>

                                            <Button type="submit"  value="submit" color="primary">Login</Button>
                                        </Form>
                                        <Loader size={40} loading={this.props.isLoading}/>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(Login);