module.exports = function(str){
    str = (str || "") + '';
    var lastLineBreakPos = str.lastIndexOf("\n");
    return str.substring(lastLineBreakPos, str.length - lastLineBreakPos);
};
