/**
 * verify the inputs fom the authentication form
 * @param {*} key 
 * @param {*} value 
 * @returns {Boolean}
 */
function validator(key, value) {
    switch (key) {
      case 'username':
      if (value.length > 0) {
        return true;
      }
      return false;
      case "email":
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(value).toLowerCase());
      case "password":
      if (value.length > 7) {
          return true;
        }
        return false;
      case "confirmPassword":
        if (!value.password)  return;
        if (value.password === value.confirm) {
          return true;
        }
        return false;
      default:
        return
    }
  }
  
  
  export default validator;
  