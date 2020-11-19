import React,{Component} from 'react';
import {Card,CardBody,Form,FormGroup,Label,Input,Button} from 'reactstrap';
import axios from 'axios';

import Error from './ErrorComponent';
import Success from './SuccesComponent';
import Loader from './LoadingComponent';
import { baseURL } from '../shared/baseURL';

function defaultStartDate() {
    let todaysDate = new Date();
    todaysDate.setDate(todaysDate.getDate() + 10);
    let date = todaysDate.toISOString().substr(0,10);
    return date;
}

function defaultStartDateMax() {
    let todaysDate = new Date();
    todaysDate.setDate(todaysDate.getDate() + 200);
    let date = todaysDate.toISOString().substr(0,10);
    return date;
}

class CreateLoanRequest extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isLoading : false,
            errMsg: '',
            successMsg: '',
            rateType: 'fixedrate'
        }
        this.handleLoanRequest = this.handleLoanRequest.bind(this);
        this.setRate = this.setRate.bind(this);
    }

    componentWillMount() {

    }

    setRate(rt) {
        this.setState({
            rateType: rt
        });
    }

    handleLoanRequest (e) {
        e.preventDefault();
        let loanRequest = {
            email : this.email.value,
            startDate : this.startdate.value,
            tenure: this.tenure.value,
            rateType: this.state.rateType,
            loanType: this.loantype.value,
            rate: this.rate.value,
            amount : this.amount.value
        };

        this.setState({
            isLoading:true,
            errMsg:'',
            successMsg:''
        });

        let config = {
            headers : {
                'x-access-token': this.props.user.token
            }
        }

        axios.post(baseURL + '/loan/createLoanRequest',loanRequest,config)
            .then((response) => {
                if  (response.data.success) {
                    this.setState({
                        successMsg: response.data.message,
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
                    errMsg: 'Something went wrong',
                    isLoading: false
                }); 
            });

        console.log(loanRequest);
    }

    render () {
        return( 
            <React.Fragment>
                <div className="container">
                    <div className="row row-content p-1" style={{marginLeft:"auto",marginRight:"auto"}}>
                        <div className="col-12 col-lg">
                            <div className="text-center">
                                <Card>
                                    <CardBody>
                                        <h4>Loan Request</h4>
                                        <Error message={this.state.errMsg} />
                                        <Success message={this.state.successMsg} />
                                        <Form onSubmit={this.handleLoanRequest}>
                                            <FormGroup>
                                                <Label htmlFor="email">Email</Label>
                                                <Input type="email" id="email" name="email"
                                                    innerRef={(input) => this.email = input} />
                                            </FormGroup>

                                            <FormGroup>
                                                <Label htmlFor="startdate">Start Date</Label>
                                                <Input type="date" id="startdate" name="startdate" defaultValue={defaultStartDate()}
                                                    min = {defaultStartDate()} max={defaultStartDateMax()}
                                                    innerRef={(input) => this.startdate = input}/>
                                                <p>Loan can be approved as soon as in 10 days from current date</p>
                                            </FormGroup>

                                            <FormGroup>
                                                <Label htmlFor="tenure">Tenure</Label>
                                                <Input type="number" id="tenure" name="tenure"
                                                    innerRef={(input) => this.tenure = input}  />
                                            </FormGroup>
                                            
                                            <FormGroup check>
                                                <Label check>
                                                    <Input type="radio" name="rate" onClick={() => this.setRate('fixedrate')} checked={true} />
                                                    Fixed Rate
                                                </Label>
                                            </FormGroup>

                                            <FormGroup check className="mb-2">
                                                <Label check>
                                                    <Input type="radio" name="rate" onClick={() => this.setRate('reducerate')} />
                                                    Reducing Interest Rate
                                                </Label>
                                            </FormGroup>

                                            <FormGroup>
                                                <Label htmlFor="tenure">Interest Rate</Label>
                                                <Input type="number" id="rate" name="rate"
                                                    innerRef={(input) => this.rate = input}  />
                                            </FormGroup>

                                            <FormGroup>
                                                <Label for="loantype">Type of Loan</Label>
                                                <Input type="select" name="loantype" id="loantype" innerRef={(input) => this.loantype = input}>
                                                    <option value="housingloan">Housing Loan</option>
                                                    <option value="studentloan">Student Loan</option>
                                                    <option value="carloan">Car Loan</option>
                                                    <option value="businessloan">Business Loan</option>
                                                    <option value="personalloan">Personal Loan</option>
                                                </Input>
                                            </FormGroup>

                                            <FormGroup>
                                                <Label htmlFor="tenure">Principal Amount</Label>
                                                <Input type="number" id="amount" name="amount"
                                                    innerRef={(input) => this.amount = input}  />
                                            </FormGroup>

                                            <Button type="submit" className="mb-2" value="submit" color="primary">Create</Button>
                                        </Form>
                                        <Loader size={40} loading={this.state.isLoading}/>
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

export default CreateLoanRequest;