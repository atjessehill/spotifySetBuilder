const Datagen = () => {
    let data = [];
    
    for(let i=1; i<101; i++){

        const point = {}
        let y;

        if (i <= 50){
            y = i;
        }
        else{
            y = 101-i;
        }
        point.x = i;
        point.y = y/100;

        data.push(y/100);
    }

    return data;
}

export default Datagen;