
module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000) //this generates a random number 
    .toString(16)    // this converts the number into a hexadecimal string
    .substring(1);   //this ensures the resulting string has 4 characters
