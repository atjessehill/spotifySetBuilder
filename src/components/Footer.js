import React from 'react';

class Footer extends React.Component {

    constructor(props){
        super(props);

    }



    render(){
        const madeWith = "Made with ";
        const by = " by "

        return (
            <div id="footer">
                <p className="sub-text"> 
                    {madeWith}
                    <i className="las la-heart"> </i>
                    {by}
                    <br className="mobileOnly"></br> 
                    <a href="https://www.linkedin.com/in/jessehillcs" className="text-links grey1">Jesse Hill </a>
                      & 
                    <a href="http://www.ronaklaungani.com" className="text-links grey1"> Ronak Laungani </a>
                </p>
                <img src="../assets/icons/jesse-ronak.svg" className="footer-img"/>
            </div>

        )


    }
}

export default Footer;