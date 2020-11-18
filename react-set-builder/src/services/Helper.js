export const Variance = (arr) => {
    
    const mean = Mean(arr);
    const variance = Mean(arr.map((d) => {
        return Math.pow(d-mean, 2);
    }));

    console.log(variance);

    return variance;
}

const sum = (arr) => {
    
}

const reducer = (accumulator, currentValue) => accumulator+currentValue;

const Mean = (arr) => {
    const sum = arr.reduce(reducer)
    return sum/arr.length;
}
