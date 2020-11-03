import React, {Component, useEffect} from 'react';

function Login(props){


    
    useEffect(() => {
        const search = props.location.search;
        const params = new URLSearchParams(search);
        const code = params.get('code')
        console.log("useeffect");
        console.log(code)
    })

    return (
      <h1>
          Login
      </h1>
    )
  }

export default Login;

// 'http://localhost:3000/?code=AQDvld2sjC5BM_7sCRJqivHB...'

// http://localhost:3000/login?code=AQDKBKySanJkYixWI4nlo8ZLWDO7CsSCilVMxoUrpSvdM0qe2SS9cibyeYeGE2ofn-Ur5fZxafTOTQ1Kj-XpuT86E23exi7n4VXksykZw0HxVE7bMujSOdfl4Hghdom70BrdSMJYX8Nq07CiZRhJNU_WkLaZvUrh6ax_V7X1jgwGPdSVSa-H4IWLE6yqCcKplD-0_q9gRg