const convert = (str, newstr, previous) => {
    // return an evaluated template string
    const replacer = (match, p1, p2, p3) => {
        var replacement =  p2 === previous ?  newstr : p2;
        return [p1, replacement, p3].join("");
    }
    var regex = new RegExp(`([^(${previous})]*)(${previous})([^(${previous})]*)`, "g");
    str = str.replace(regex, replacer);
    return str;
  }

  export default convert;