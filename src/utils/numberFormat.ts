export default (number:number|undefined):string =>{
    
    if(!number && number!=0) return 'NaN';
    
    const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];
    // what tier? (determines SI symbol)
    var tier = Math.log10(Math.abs(number)) / 3 | 0;

    // if zero, we don't need a suffix
    if(tier == 0) return number.toLocaleString();

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    if (scaled % 1 !== 0) {
        // has a decimal part, return with one decimal place
        return scaled.toFixed(1) + suffix;
    } else {
        // no decimal part, return as an integer
        return scaled.toFixed(0) + suffix;
    }
}