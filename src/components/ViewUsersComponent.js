import React, { Component } from 'react';
import {Table,Button,Modal,ModalBody,ModalHeader,ModalFooter,Form,FormGroup,Label,Input} from 'reactstrap'
import axios from 'axios';

import Loader from './LoadingComponent';
import Error from './ErrorComponent';

import {baseURL} from '../shared/baseURL';

function User({id,user,fun}) {
    // console.log("id : ",id," user : ",user);
    return (
        <tr>
            <th scope="row">{id}</th>
            <td>{user.Firstname}</td>
            <td>{user.Lastname}</td>
            <td>{user.Email}</td>
            <td>{user.Role}</td>
            <td><Button onClick={() => fun(user)}>Edit</Button></td>
        </tr>
    );
}

class ViewUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usersLoading : true,
            listOfUsers: null,
            errMsg: '',
            updateErrMsg: '',
            userSelected: '',
            isModalOpen: false,
            isUpdating : false,
            feildFirstName: true,
            feildLastName: true,
            fieldPhoneNo: true 
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleFields = this.toggleFields.bind(this);
        this.selectUser =  this.selectUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }
    componentDidMount() {
        if(this.props.flag) {
            let config = {
                headers: {
                    'x-access-token': this.props.user.token
                }
            }
            axios.post(baseURL + '/users/getUsers',{
                role: this.props.user.role
            },config).then((response) => {
                if (response.data.length === 0) {
                    this.setState({
                        errMsg: 'No users found'
                    });
                } else {
                    this.setState({
                        usersLoading: false,
                        listOfUsers: response.data
                    });
                }
            })
              .catch((err) => {
                  this.setState({
                      errMsg: 'error in fetching users'
                  });
              });
        }
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    toggleFields(field) {
        switch (field) {
            case 'firstname':
                this.setState({
                    feildFirstName: !this.state.feildFirstName
                });
                break;
            case 'lastname':
                this.setState({
                    feildLastName: !this.state.feildLastName
                });
                break;
            case 'phoneno':
                this.setState({
                    fieldPhoneNo: !this.state.fieldPhoneNo
                });
                break;
            default:
                break;
        }
    }

    selectUser(user) {
        // console.log('selected user : ',JSON.stringify(user));
        
        this.setState({
            userSelected: user,
            updateErrMsg: '',
            isUpdating: false
        }, () => {
            this.toggleModal();
        }); 
    }

    updateUser(e) {
        e.preventDefault();
        this.setState({
            isUpdating: true
        });
        let updatedFields = {};
        updatedFields.email = this.state.userSelected.Email;
        if (this.state.feildFirstName) {
            updatedFields.firstname = this.firstname.value;
        }
        if (this.state.feildLastName) {
            updatedFields.lastname = this.lastname.value;
        }
        if (this.state.fieldPhoneNo) {
            updatedFields.phoneno = this.phoneno.value;
        }
        let config = {
            headers: {
                'x-access-token': this.props.user.token
            }
        }
        axios.post(baseURL + '/users/updateUser',updatedFields,config)
            .then((response) => {
                console.log(response.data);
                if (response.data.success) {
                    
                    let lu = this.state.listOfUsers;
                    alert('updated successfully');
                    for (let i = 0 ; i < lu.length ; i++) {
                        if (lu[i].Email === this.state.userSelected.Email) {
                            let temp = lu[i];
                            temp.Firstname = response.data.updated.Firstname;
                            temp.Lastname = response.data.updated.Lastname;
                            lu[i] = temp;
                            break;
                        }
                    }

                    this.toggleModal();
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

    render() {
        if (this.props.flag) {
            if(this.state.usersLoading) {
                return (
                    <Loader size={40} loading={this.state.usersLoading} />
                );
            } else {
                if (this.state.listOfUsers && this.state.listOfUsers.length !== 0) {
                
                    return (
                        <React.Fragment>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Sr.NO</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Edit User</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.listOfUsers.map((el,idx) => <User key={idx} id={idx+1} user={el} fun={this.selectUser}/> )}
                                    </tbody>
                                </Table>
                                <div>
                                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                                        <ModalHeader toggle={this.toggleModal}>
                                            Edit : {this.state.userSelected.Firstname + ' ' + this.state.userSelected.Lastname}
                                            <h6>Email : {this.state.userSelected.Email}</h6>
                                            <h6>Role : {this.state.userSelected.Role}</h6>
                                        </ModalHeader>

                                        <ModalBody>
                                            <Error message={this.state.updateErrMsg} />
                                            <Form onSubmit={this.updateUser}>
                                                <FormGroup>
                                                    <Label htmlFor="firstname" className="mr-4">Firstname</Label>
                                                    <Input type="checkbox" onClick={() => this.toggleFields('firstname')} defaultChecked={this.state.feildFirstName} className="mt-2" />
                                                    <Input type="text" disabled = {!this.state.feildFirstName} id="firstname" name="firstname"
                                                        innerRef={(input) => this.firstname = input} />
                                                </FormGroup>
                                                
                                                <FormGroup>
                                                    <Label htmlFor="lastname" className="mr-4">Lastname</Label> 
                                                    <Input type="checkbox" onClick={() => this.toggleFields('lastname')} defaultChecked={this.state.feildLastName} className="mt-2" />
                                                    <Input type="text" disabled = {!this.state.feildLastName} id="lastname" name="lastname"
                                                        innerRef={(input) => this.lastname = input} />
                                                </FormGroup>

                                                <FormGroup>
                                                    <Label htmlFor="phoneno" className="mr-4">Phone no</Label> 
                                                    <Input type="checkbox" onClick={() => this.toggleFields('phoneno')} defaultChecked={this.state.fieldPhoneNo} className="mt-2" />
                                                    <Input type="number" disabled = {!this.state.fieldPhoneNo} id="phoneno" name="phoneno"
                                                        innerRef={(input) => this.phoneno = input} />
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
                            <Error message={this.state.errMsg}/>
                        </React.Fragment>
                    );
                }
            }
        } else {
            return (
                <React.Fragment>
    
                </React.Fragment>
            );
        }
    }
}
    

export default ViewUsers;