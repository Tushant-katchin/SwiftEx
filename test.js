
function getLength(inputStr) {
    let finalLength=0;
       var max =0
       var current_string =""
       var i;
       var char
       for(i=0;i<inputStr.length;i+=1){
           char=inputStr.charAt(i)
           pos = current_string.indexOf(char)
           if(pos!==-1){
               current_string = current_string.substr(pos+1)
           }
           current_string += char
           max =Math.max(max, current_string.length)
       }
       console.log(max)
       finalLength = max
    //wite your logic here and return finalLength; 
    //kindly remove console.log statements before running tests 
    return finalLength;};

    const merge = intervals => {
        if (intervals.length < 2) return intervals;
        
        intervals.sort((a, b) => a[0] - b[0]);
        
        const result = [];
        let previous = intervals[0];
        
        for (let i = 1; i < intervals.length; i += 1) {
          if (previous[1] >= intervals[i][0]) {
            previous = [previous[0], Math.max(previous[1], intervals[i][1])];
          } else {
            result.push(previous);
            previous = intervals[i];
          }
        }
        
        result.push(previous);
        console.log(result)
        return result;
      };

const test = (a) => (b) =>{
    console.log(a+b)
    return a+b
}
const a = test(10)
//a(20)

//merge([[1,4],[4,5]])
    //getLength('strjjjkhdydy')