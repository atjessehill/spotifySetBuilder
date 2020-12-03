import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';

const GenerateButton = (props) => {
    // const [fillValue, setSeconds] = useState(0);
    let history = useHistory();

    function handleClick(){
        history.push("/generate");
    }

    return (
        <div className="float-to-right">
        <button className="button-line orange" onClick={handleClick}> 
            <img className="button-icons" src="../assets/icons/plus-circle-orange.svg" />
             Generate new playlist
            <div className="button-bg orange-bg"></div>
        </button>
    </div>
    )
}

export default GenerateButton;