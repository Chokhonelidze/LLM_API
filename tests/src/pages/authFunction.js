import React from "react";
import { Outlet, useOutlet } from "react-router-dom";

function Protected() {
    return (<div>
        <Outlet />
    </div>)
}


export {Protected}