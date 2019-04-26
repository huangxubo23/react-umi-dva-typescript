/**
 * Created by 薛荣晖 on 2018/10/11 0011下午 4:25.
 */

/**
 * Created by shiying on 17-7-21.
 */


import ReactChild from "../../../../../../lib/util/ReactChild";
import React from "react";
import BusinessRegister from "../../../business/page/businessRegister/businessRegister.js"

class UserRegister extends ReactChild {

    render() {
        return (
            <BusinessRegister callback={() => {
                location.href = window.location.origin + "/pc/admin/index/homePage"
            }}/>
        )
    }
}

export default UserRegister;