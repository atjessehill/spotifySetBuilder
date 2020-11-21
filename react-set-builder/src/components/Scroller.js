import React from 'react';
import '../App.css';

class Scroller extends React.Component {

    constructor(props){
        console.log(props)
        super(props);
        this.state = {
            startNumber: 6,
            endNumber: 99,
            widthOfOneColumn: 50,
            stepValue: 1
        }
        this.getScrollLeft = this.getScrollLeft.bind(this);

    }


    getScrollLeft(){
		// const finalValue = ((((scroller.scrollLeft)/widthOfOneColumn)*stepValue)+startNumber);
        // printvalue.innerHTML = "" + finalValue + "";
        const scroller = document.getElementById('scroller');
		const finalValue = ((((scroller.scrollLeft)/50)*1)+6);
        console.log(finalValue);

    }

    componentDidMount(){
    
    }


    render(){
        let z = this.state.startNumber;
        const endNumber = this.state.endNumber;
        const stepValue = this.state.stepValue;
        const listItems = [];
        const opacity0 = {
            opacity: "0%"
        }
        const opacity100 = {
            opacity: "100%"
        }
        while(z < endNumber+stepValue+1){
            const chosenOpacity = (z > endNumber) ? opacity0:opacity100
            listItems.push(<p key={z} className="numberInScroller" style={chosenOpacity}>{z}</p>);
            z=z+stepValue;
        }

        return (
            <div>
            <div id="scroller">
              <div id="scroller-block">
                {listItems}
              </div>
            </div>
            <div id="selectedValueIndicator"></div>

            <button onClick={this.getScrollLeft}>Get Value</button>

            <p id="scrollValue"></p>

            {/* <script type="text/javascript" src="scroller.js"></script> */}

            </div>

        )


    }
}

export default Scroller;