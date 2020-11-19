import React from 'react';

function Success({message}) {
    if (message) {
        return ( 
            <React.Fragment>
                <div className="container">
                    <div className="row row-header">
                        <div className="col-12 col-lg">
                            <div className="alert alert-success" style={{marginRight:'auto',marginLeft:'auto'}}>
                                <p>{message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
            </React.Fragment>
        );
    }
};

export default Success;