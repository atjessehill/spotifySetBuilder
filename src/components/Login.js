import React, { useEffect} from 'react';
import request from 'request';
import Cookies from 'universal-cookie';
import { profile } from '../services/SpotifyCalls';

const { REACT_APP_SPOT_CLIENT, REACT_APP_SPOT_CLIENT_SECRET, REACT_APP_CALLBACK_PLAIN_GENERATE, REACT_APP_CALLBACK_PLAIN_HOME } = process.env;

function Login(props){
    console.log(props.location.pathname.split('/'));

    let destination = props.location.pathname.split('/')[2] !== "home" ? "/generate" : '/';
    
    console.log(destination)
    useEffect(() => {
        const cookies = new Cookies();
        const search = props.location.search;
        const params = new URLSearchParams(search);
        const authCode = params.get('code')
        const redirect = destination === "/" ?  REACT_APP_CALLBACK_PLAIN_HOME : REACT_APP_CALLBACK_PLAIN_GENERATE
        console.log(redirect);
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

        console.log(authOptions);

        request.post(authOptions, (error, response, body) => {
            if(response.statusCode === 200){
                cookies.set('SPOT_USER_accessToken', body.access_token, {path: '/'});
                cookies.set('SPOT_USER_refreshToken', body.refresh_token, {path: '/'});
                profile()
                .then(() => {
                    console.log("going now");
                    props.history.push(destination)

                })
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