import React, {Component} from 'react';
import {Button, Table} from 'reactstrap';
import axios from 'axios';

import Error from './ErrorComponent';
import Success from './SuccesComponent';
import Loader from './LoadingComponent';
import { baseURL } from '../shared/baseURL';

function getLoanType(type) {
    switch(type) {
        case 'housingloan':
            return 'Housing Loan';
        case 'studentloan':
            return 'Student Loan';
        case 'carloan':
            return 'Car Loan';
        case 'businessloan':
            return 'Business Loan';
        case 'personalloan':
            return 'Personal Loan';
        default:
            return 'Other';
    }
}

function  RenderLoanStatus({status}) {
    switch (status) {
        case "NEW": 
            return (
                <div className="alert alert-primary">
                    <h6 className="text-center">{status}</h6>
                </div>
            );
        case "APPROVED": 
            return (
                <div className="alert alert-success">
                    <h6 className="text-center">{status}</h6>
                </div>
            );
        case "REJECTED": 
            return (
                <div className="alert alert-danger text-center">
                    <h6 className="text-center">{status}</h6>
                </div>
            );
        default: 
            return (
                <div className="alert alert-dark text-center">
                    <h6>{status}</h6>
                </div>
            );
    }
}

function Loan({id,loan,appr,rej}) {
    // console.log("id : ",id," loan : ",loan);
    return (
        <tr>
            <th scope="row">{id}</th>
            <td>{loan.ApplicantFirstname + ' ' + loan.ApplicantLastname}</td>
            <td>{loan.Email}</td>
            <td>{getLoanType(loan.LoanType)}</td>
            <td>{loan.Amount}</td>
            <td><RenderLoanStatus status={loan.Status} /></td>
            <td>
                <Button className="btn-success" onClick={appr} style={{width:'100%'}}>Approve</Button>{' '}
                <Button className="btn-danger" onClick={rej} style={{width:'100%'}}>Reject</Button>
            </td>
        </tr>
    );
}

class ApproveLoanRequest extends Component {

    constructor (props) {
        super(props);
        this.state = {
            isLoading: false,
            loans: null,
            errMsg: '',
            updateErrMsg: '',
            isUpdating: false,
            successMsg: ''
        };
        this.updateLoanRequestStatus = this.updateLoanRequestStatus.bind(this);
        this.fetchLoans = this.fetchLoans.bind(this);
    }

    componentWillMount() {
        this.fetchLoans();
    }

    fetchLoans() {
        this.setState({
            isLoading: true,
            errMsg:''
        });

        let config = {
            headers: {
                'x-access-token': this.props.user.token
            }
        };

        let filter = {
            Status: "NEW"
        };
        axios.post(baseURL + '/loan/viewLoans',filter,config)
            .then((response) => {
                if (response.data.success) {
                    this.setState({
                        isLoading:false,
                        loans: response.data.loans
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        errMsg: response.data.message
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    isLoading: false,
                    errMsg: 'unable to fetch loans'
                });
            });
    }

    updateLoanRequestStatus (loanID,status) {
        // console.log("loan id : ",loanID," status : ",status);
        this.setState({
            isUpdating: true,
            updateErrMsg: '',
            successMsg:''
        });

        let config = {
            headers: {
                'x-access-token': this.props.user.token
            }
        };

        let loan = {
            loanID: loanID,
            status: status
        };
        axios.post(baseURL + '/loan/updateStatus',loan,config)
            .then((response) => {
                if (response.data.success) {
                    this.setState({
                        isUpdating:false,
                        successMsg: response.data.message
                    });
                    setTimeout(this.fetchLoans(),2000);
                } else {
                    this.setState({
                        isUpdating: false,
                        updateErrMsg: response.data.message
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    isUpdating: false,
                    updateErrMsg: 'unable to fetch loans'
                });
            });
    }

    render () {
        if (this.state.isLoading) {
            return (
                <Loader size={40} loading={this.state.isLoading} />
            )
        } else if (this.state.loans && this.state.loans.length !== 0) {
                return (
                    <React.Fragment>
                        <Error message={this.state.errMsg} />
                        <Success message={this.state.successMsg} />
                        <Loader size={40} loading={this.state.isUpdating}/>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Sr.NO</th>
                                    <th>Applicant Name</th>
                                    <th>Email</th>
                                    <th>Loan Type</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Approve/Reject</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.loans.map((el,idx) => <Loan key={idx} id={idx+1} loan={el} 
                                appr={() => {this.updateLoanRequestStatus(el._id,"APPROVED")}}
                                rej={() => {this.updateLoanRequestStatus(el._id,"REJECTED")}}
                                 /> )}
                            </tbody>
                        </Table>
                    </React.Fragment>
                );
        } else {
            return (
                <React.Fragment>
                    <h5>No Pending Loans Found</h5>
                </React.Fragment>
            );
        }
    }
}

export default ApproveLoanRequest;