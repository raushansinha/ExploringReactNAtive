const validate = (val, rules, connectedValue) => {
    let isValid = true;
    for( let rule in rules) {
        switch(rule) {
            case 'isEmail':
                isValid = isValid && emailVailidator(val);
                break;
            case 'minLength': 
                isValid = isValid && minLengthValidatot(val, rules[rule]);
                break;
            case 'equalTo':
                isValid = isValid && equalToValidator(val, connectedValue[rule]);  
                break;
            case 'notEmpty':
                isValid = isValid && notEmptyValidator(val); 
                break;
            default:
                isValid = true;
        }
    }

    return isValid;
}

const emailVailidator = (val) => {
    var regExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return regExp.test(val);
}

const minLengthValidatot = (val, minLength) => {
    return val.length >= minLength;
}

const equalToValidator = (val, matchingValue) => {
    return val === matchingValue;
}

const notEmptyValidator = (val) => {
  return val.trim() !== "";
}

export default validate;