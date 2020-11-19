import React from 'react';

function Footer(props) {
    return(
    <div className="footer">
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-auto">
                    <p> LMS © Copyright {new Date().getFullYear()}</p>
                    <p>Developed By  : <a href="http://aniruddhatonge.netlify.app/">Aniruddha Tonge</a></p>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Footer;