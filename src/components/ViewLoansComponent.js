import React, {Component} from 'react';
import {Button, Table,Input,Form,FormGroup,Label,ModalHeader,Modal,ModalBody,ModalFooter} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import axios from 'axios';

import {baseURL} from '../shared/baseURL';
import Error from './ErrorComponent';
import Loader from './LoadingComponent';

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

function Loan({id,loan,role,fun}) {
    // console.log("id : ",id," loan : ",loan);
    if (role === 'agent') {
        return (
            <tr>
                <th scope="row">{id}</th>
                <td>{loan.ApplicantFirstname + ' ' + loan.ApplicantLastname}</td>
                <td>{loan.Email}</td>
                <td>{getLoanType(loan.LoanType)}</td>
                <td>{loan.Amount}</td>
                <td>{loan.Rate}</td>
                <td><RenderLoanStatus status={loan.Status} /></td>
                <td><Button disabled={loan.Status === 'APPROVED'} onClick={fun}>Edit Loan</Button></td>
            </tr>
        );
    } else {
        return (
            <tr>
                <th scope="row">{id}</th>
                <td>{loan.ApplicantFirstname + ' ' + loan.ApplicantLastname}</td>
                <td>{loan.Email}</td>
                <td>{getLoanType(loan.LoanType)}</td>
                <td>{loan.Amount}</td>
                <td>{loan.Rate}</td>
                <td><RenderLoanStatus status={loan.Status} /></td>
            </tr>
        );
    }
}

class ViewLoans extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loans: null,
            isLoading: false,
            errMsg: '',
            isUpdating: false,
            updateErrMsg: '',
            isModalOpen: false,
            loanSelected: '',
            fieldAmount: true,
            fieldLoanType: true,
            fieldAPF: true,
            fieldAPL: true,
            fieldRate: true,
            firstname: "",
            lastname: "",
            amount: "",
            rate: "",
            loantype: "",
            filterloantype: "all",
            filterstatus: "all"
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleFields = this.toggleFields.bind(this);
        this.selectLoan = this.selectLoan.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fetchLoans = this.fetchLoans.bind(this);
        this.updateLoan = this.updateLoan.bind(this);
    }

    fetchLoans() {
        this.setState({
            isLoading: true,
            errMsg: '',
            isModalOpen: false,
        });

        let config = {
            headers: {
                'x-access-token': this.props.user.token
            }
        }
        let filter = {};  

        if (this.props.user.role === 'customer') {
            filter.email = this.props.user.email;
        }
        if (this.state.filterloantype !== 'all') {
            filter.loantype = this.state.filterloantype
        }
        if(this.state.filterstatus !== 'all') {
            filter.status = this.state.filterstatus;
        }
        console.log('filter');
        console.log(filter);
        axios.post(baseURL + '/loan/viewLoans',filter,config)
        .then((response) => {
            if (response.data.success) {
                // console.log(response.data);
                this.setState({
                    loans: response.data.loans,
                    isLoading: false
                });
            } else {
                this.setState({
                    errMsg: response.data.message,
                    isLoading: false
                });
            }
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                errMsg: 'Error in fetching Loans',
                isLoading: false
            });
        });
    }

    componentWillMount() {

        if(this.props.user === null) {
            // console.log('user  : ' , this.props.user);
            this.props.history.push('/login');
        } else {
            this.fetchLoans();
        }

    }

    selectLoan(loan) {
        // console.log('selected user : ',JSON.stringify(user));
        
        this.setState({
            loanSelected: loan,
            updateErrMsg: '',
            isUpdating: false,
            firstname: loan.ApplicantFirstname,
            lastname: loan.ApplicantLastname,
            amount: loan.Amount,
            rate: loan.Rate,
            loantype: loan.LoanType
        }, () => {
            this.toggleModal();
        }); 
    }

    handleChange(e) {
        let oflt = this.state.filterloantype;
        let ofs = this.state.filterstatus;
        this.setState({
            [e.target.name] : e.target.value
        }, () => {
            if ((oflt !== this.state.filterloantype) || (ofs !== this.state.filterstatus)) {
                this.fetchLoans();
            }
        });
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    toggleFields(field) {
        switch (field) {
            case 'amount':
                this.setState({
                    fieldAmount: !this.state.fieldAmount
                });
                break;
            case 'firstname':
                this.setState({
                    fieldAPF: !this.state.fieldAPF
                });
                break;
            case 'lastname':
                this.setState({
                    fieldAPL: !this.state.fieldAPL
                });
                break;
            case 'loantype':
                this.setState({
                    fieldLoanType: !this.state.fieldLoanType
                });
                break;
            case 'rate':
                this.setState({
                    fieldRate: !this.state.fieldRate
                });
                break;
            default:
                break;
        }
    }

    updateLoan(e) {
        e.preventDefault();
        this.setState({
            isUpdating: true
        });
        
        let updatedFields = {};
        
        updatedFields.loanID = this.state.loanSelected._id;

        if (this.state.fieldAmount) {
            updatedFields.amount = this.amount.value;
        }
        if (this.state.fieldAPF) {
            updatedFields.firstname = this.firstname.value;
        }
        if (this.state.fieldAPL) {
            updatedFields.lastname = this.lastname.value;
        }
        if (this.state.fieldLoanType) {
            updatedFields.loantype = this.loantype.value;
        }
        if (this.state.fieldRate) {
            updatedFields.rate = this.rate.value;
        }
        let config = {
            headers: {
                'x-access-token': this.props.user.token
            }
        }
        axios.post(baseURL + '/loan/updateLoan',updatedFields,config)
            .then((response) => {
                console.log(response.data);
                if (response.data.success) {
                    
                    // let loans = this.state.loans;
                    alert('updated successfully');
                    this.toggleModal();
                    this.fetchLoans();
                } else {
                    console.log('error in updating');
                    this.setState({
                        updateErrMsg: 'update failed',
                        isUpdating:false
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    updateErrMsg: 'update failed',
                    isUpdating: false
                });
            });
    }

    render () {
        if (this.state.loans && this.state.loans.length !== 0) {
            return (
                    <React.Fragment>
                        <Error message={this.state.errMsg}/>
                        <div className="container">
                            <div className="row">
                                <div className="col-12 col-md-4">
                                    <Label htmlFor="filterloantype" className="mr-4"><strong>Loan Type</strong></Label>     
                                    <Input type="select" id="filterloantype" name="filterloantype"
                                        onChange={this.handleChange} value={this.state.filterloantype}>
                                        <option value="all">All</option>
                                        <option value="housingloan">Housing Loan</option>
                                        <option value="studentloan">Student Loan</option>
                                        <option value="carloan">Car Loan</option>
                                        <option value="businessloan">Business Loan</option>
                                        <option value="personalloan">Personal Loan</option>
                                    </Input>
                                </div>
                                <div className="col-12 col-md-4 mb-4">
                                <Label htmlFor="filterstatus" className="mr-4"><strong>Loan Status</strong></Label>     
                                    <Input type="select" id="filterstatus" name="filterstatus"
                                        onChange={this.handleChange} value={this.state.filterstatus}>
                                        <option value="all">All</option>
                                        <option value="NEW">New</option>
                                        <option value="APPROVED">Approved</option>
                                        <option value="REJECTED">Rejected</option>
                                    </Input>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Sr.NO</th>
                                        <th>Applicant Name</th>
                                        <th>Applicant Email</th>
                                        <th>Loan Type</th>
                                        <th>Amount</th>
                                        <th>Rate</th>
                                        <th>Status</th>
                                        <th>{this.props.user.role === 'agent' ? 'Edit Loan' : null}</th>                                </tr>
                                </thead>
                                <tbody>
                                    {this.state.loans.map((el,idx) => <Loan key={idx} id={idx+1} loan={el} role={this.props.user.role} fun={() => this.selectLoan(el)}/> )}
                                </tbody>
                            </Table>
                        </div>
                        <div>
                            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                                <ModalHeader toggle={this.toggleModal}>
                                    Edit : {this.state.loanSelected._id}
                                    <h6>Applicant Name : {this.state.loanSelected.ApplicantFirstname + ' ' + this.state.loanSelected.ApplicantLastname}</h6>
                                    <h6>Email : {this.state.loanSelected.Email}</h6>
                                </ModalHeader>

                                <ModalBody>
                                    <Error message={this.state.updateErrMsg} />
                                    <Form onSubmit={this.updateLoan}>
                                        <FormGroup>
                                            <Label htmlFor="firstname" className="mr-4">Applicant Firstname</Label>
                                            <Input type="checkbox" onClick={() => this.toggleFields('firstname')} defaultChecked={this.state.fieldAPF} className="mt-2" />
                                            <Input type="text" disabled = {!this.state.fieldAPF} id="firstname" name="firstname"
                                                innerRef={(input) => this.firstname = input} onChange={this.handleChange} value={this.state.firstname} />
                                        </FormGroup>
                                        
                                        <FormGroup>
                                            <Label htmlFor="lastname" className="mr-4">Applicant Lastname</Label> 
                                            <Input type="checkbox" onClick={() => this.toggleFields('lastname')} defaultChecked={this.state.fieldAPL} className="mt-2" />
                                            <Input type="text" disabled = {!this.state.fieldAPL} id="lastname" name="lastname"
                                                innerRef={(input) => this.lastname = input} onChange={this.handleChange} value={this.state.lastname} />
                                        </FormGroup>

                                        <FormGroup>
                                            <Label htmlFor="loantype" className="mr-4">Loan Type</Label> 
                                            <Input type="checkbox" onClick={() => this.toggleFields('loantype')} defaultChecked={this.state.fieldLoanType} className="mt-2" />
                                            <Input type="select" disabled = {!this.state.fieldLoanType} id="loantype" name="loantype"
                                                innerRef={(input) => this.loantype = input} onChange={this.handleChange} value={this.state.loantype}>
                                                <option value="housingloan">Housing Loan</option>
                                                <option value="studentloan">Student Loan</option>
                                                <option value="carloan">Car Loan</option>
                                                <option value="businessloan">Business Loan</option>
                                                <option value="personalloan">Personal Loan</option>
                                            </Input>
                                        </FormGroup>

                                        <FormGroup>
                                            <Label htmlFor="amount" className="mr-4">Amount</Label> 
                                            <Input type="checkbox" onClick={() => this.toggleFields('amount')} defaultChecked={this.state.fieldAmount} className="mt-2" />
                                            <Input type="number" disabled = {!this.state.fieldAmount} id="amount" name="amount"
                                                innerRef={(input) => this.amount = input} onChange={this.handleChange} value={this.state.amount}/>
                                        </FormGroup>

                                        <FormGroup>
                                            <Label htmlFor="rate" className="mr-4">Rate</Label> 
                                            <Input type="checkbox" onClick={() => this.toggleFields('rate')} defaultChecked={this.state.fieldRate} className="mt-2" />
                                            <Input type="number" disabled = {!this.state.fieldRate} id="rate" name="rate"
                                                innerRef={(input) => this.rate = input} onChange={this.handleChange} value={this.state.rate}/>
                                        </FormGroup>

                                        <Button type="submit"  value="submit" color="primary">Update</Button>
                                        <Loader size={30} loading={this.state.isUpdating}/>
                                    </Form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                    </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-4">
                                <Label htmlFor="filterloantype" className="mr-4"><strong>Loan Type</strong></Label>     
                                <Input type="select" id="filterloantype" name="filterloantype"
                                    onChange={this.handleChange} value={this.state.filterloantype}>
                                    <option value="all">All</option>
                                    <option value="housingloan">Housing Loan</option>
                                    <option value="studentloan">Student Loan</option>
                                    <option value="carloan">Car Loan</option>
                                    <option value="businessloan">Business Loan</option>
                                    <option value="personalloan">Personal Loan</option>
                                </Input>
                            </div>
                            <div className="col-12 col-md-4 mb-4">
                            <Label htmlFor="filterstatus" className="mr-4"><strong>Loan Status</strong></Label>     
                                <Input type="select" id="filterstatus" name="filterstatus"
                                    onChange={this.handleChange} value={this.state.filterstatus}>
                                    <option value="all">All</option>
                                    <option value="NEW">New</option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="REJECTED">Rejected</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                    
                    <h2>No Loans Found !!</h2>
                </React.Fragment>
            );
        }
    }

}

export default withRouter(ViewLoans);