import React from 'react';
import HashLoader from "react-spinners/HashLoader";
import { css } from "@emotion/react";


function Loader({size,loading}) {


    const override = css`
        display: block;
        margin: 0 auto;
        border-color: red;
    `;

    return (
        <div>
            <HashLoader
                css={override}
                size={size}
                color={"#212121"}
                loading={loading}
            />
        </div>
    );
}

export default Loader;