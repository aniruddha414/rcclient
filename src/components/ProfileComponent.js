import React,{Component} from 'react';
import {Card,CardBody,NavLink,NavItem,TabContent,TabPane,Nav,Row,Col} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import classnames from 'classnames';

import ViewUsers from './ViewUsersComponent';
import ApproveLoanRequest from './ApproveLoanRequestComponent';
import CreateLoanRequest from './CreateLoanRequestComponent';

const getRoles = (role) => {
    switch(role) {
        case 'agent':
            return 'Agent';
        case 'customer':
            return 'Customer';
        case 'admin':
            return 'Admin';
    }
};

function RenderSecondTab({user}) {
    if (user.role === 'agent') {
        return (
            <React.Fragment>
                <Col sm="12">
                    <h5>New Loan Request</h5>
                </Col>
                <Col sm="12">
                    <CreateLoanRequest user={user} />
                </Col>
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <Col sm="12">
                    <h5>List of Loans for Approval</h5>
                </Col>
                <Col sm="12">
                    <ApproveLoanRequest user={user} />   
                </Col>
            </React.Fragment>
        );
    }
}

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1'
        }
        this.toggle = this.toggle.bind(this);
    }

    componentWillMount() {
        if(this.props.user === null) {
            console.log('user  : ' , this.props.user);
            this.props.history.push('/login');
        }
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {

        const Dashboard = ({user}) => {
            if (user === 'customer') {
                return (
                    <div className="col-12 col-lg-12 mt-4">
                        <p>user profile</p>
                    </div>
                );
            } else {
                return (
                    <div className="col-12 col-lg-12 mt-4">
                                <Nav tabs>
                                    <NavItem style={{width:'50%'}}>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '1' })}
                                            onClick={() => {this.toggle('1'); }}
                                        >
                                        <h4><strong>View Users</strong></h4>
                                    </NavLink>
                                    </NavItem>
                                    <NavItem style={{width:'50%'}}>
                                        <NavLink
                                            className={classnames({ active: this.state.activeTab === '2' })}
                                            onClick={() => { this.toggle('2'); }}
                                        >
                                            <h4><strong>{this.props.user.role === 'agent' ? 'Create Loan Request' : 'Approve Loan'}</strong></h4>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.activeTab}>
                                    <TabPane tabId="1">
                                        <Row className="p-2">
                                            <Col sm="12">
                                                <h5>List of Users</h5>
                                            </Col>
                                            <Col sm="12">
                                                <div className="table-responsive">
                                                    <ViewUsers user={this.props.user} flag={(this.props.user.role === 'agent' || this.props.user.role === 'admin') ? true: false }/>
                                                </div>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <Row>
                                            <RenderSecondTab user={this.props.user} />
                                        </Row>
                                    </TabPane>
                                </TabContent>
                                </div>
                );
            }
        }

        if (this.props.user) {
            return (
                <React.Fragment>
                    <div className="container">
                        <div className="row row-header p-4" style={{width:"90%",marginLeft:"auto",marginRight:"auto"}}>
                            <div className="col-12 col-lg-12" >
                                <h4>Welcome !!</h4>
                                <Card>
                                    <CardBody>
                                        <h5>Name : {this.props.user.firstname + ' ' + this.props.user.lastname}</h5>
                                        <h6>Role : {getRoles(this.props.user.role)} </h6>
                                    </CardBody>
                                </Card>
                            </div>
                            <Dashboard user={this.props.user.role}/>
                        </div>  
                    </div>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                </React.Fragment>
            );
        }
    }
}

export default withRouter(Profile);