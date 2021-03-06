import React from 'react';
import '../App.css';

class Scroller extends React.Component {

    constructor(props){
        console.log(props)
        super(props);
        this.state = {
            startNumber: 6,
            endNumber: 25,
            widthOfOneColumn: 50,
            stepValue: 1
        }

        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);

    }

    prev(){
        const scroller = document.getElementById("scroller");
        scroller.scrollLeft-=50
    }

    next(){
        const scroller = document.getElementById("scroller");
        scroller.scrollLeft+=50
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

            <div id="scroller-package">
            <button class="scroll-bttns" id="goPrev" onClick={this.prev}><i class="las la-angle-left"></i></button>

                <div id="scroller">
                    <div id="scroller-block">
                        {listItems}
                    </div>
                </div>

                <button class="scroll-bttns" id="goNext" onClick={this.next}><i class="las la-angle-right"></i></button>
            </div>
            <div id="selectedValueIndicator"></div>

            {/* <button onClick={this.getScrollLeft}>Get Value</button> */}

            <p id="scrollValue"></p>

            {/* <script type="text/javascript" src="scroller.js"></script> */}

            </div>

        )


    }
}

export default Scroller;