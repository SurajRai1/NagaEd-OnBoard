

function reverseString(str) {
    let reverse = "";
    for(let i = str.length - 1; i >= 0; i--) {
        reverse += str[i];
    }
    return reverse;
}
const reverseString = (str) => str.reduce((acc, res )=> acc + res, 0)
console.log(reverseString("hello"));