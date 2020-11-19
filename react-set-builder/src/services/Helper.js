export const Variance = (arr) => {
    
    const mean = Mean(arr);
    const variance = Mean(arr.map((d) => {
        return Math.pow(d-mean, 2);
    }));
    return variance;
}

const sum = (arr) => {
    
}

const reducer = (accumulator, currentValue) => accumulator+currentValue;

export const Mean = (arr) => {
    const sum = arr.reduce(reducer)
    return sum/arr.length;
}

export const getRandInt = (min, max) => {

    return Math.floor(Math.random() * (max-min) + min);

}

export const getRandArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
}

export const stdDev = (arr) => {
    const avg = Mean(arr);
    const squareDiffs = arr.map(value => {
        let diff = value - avg;
        return diff * diff;
    });

    const avgSquareDiff = Mean(squareDiffs);
    return Math.sqrt(avgSquareDiff);    
}

export const getSubsets = (arr, length) => {

    // if(index == r){
    //     for(let j=0; j<r; j++){

    //     }
    // }

    // if(i>= n)return;

    // data[index] = arr[i]
    // getSubsets(arr, n, r, index+1, data, i+1)
    // getSubsets(arr, n, r, index, data, i+1)

    // return data;


    // return arr.reduce((subsets, value) => subsets.concat(
    //     subsets.map((set) => {
    //         // let s =
    //         // console.log(s)
    //         // console.log(s.length)
    //         // if(s.length == length)return s
    //         // else return [];
    //         [...set, value]
    //     })
    // ),
    // [[]]
    // );
}