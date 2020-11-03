import Axios from 'axios';
import React, {Component, useEffect} from 'react';
import axios from 'axios';
import querystring from 'querystring'
import request from 'request';
const { REACT_APP_SPOT_CLIENT, REACT_APP_SPOT_CLIENT_SECRET } = process.env;

function Login(props){
  
    useEffect(() => {
        const search = props.location.search;
        const params = new URLSearchParams(search);
        const authCode = params.get('code')
        const redirect = 'http://localhost:3000/login'
        const clientId = REACT_APP_SPOT_CLIENT;
        const clientSecret = REACT_APP_SPOT_CLIENT_SECRET;


        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: authCode,
                redirect_uri: redirect,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic '+ btoa(clientId+':'+clientSecret),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            json: true
        }

        request.post(authOptions, (error, response, body) => {

            if(response.statusCode == 200){
                const accessToken = body.access_token;
                const refreshToken = body.refresh_token;

            }
        })

 
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