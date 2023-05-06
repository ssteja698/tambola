import cookie from "js-cookie";

export const cookieSet = (key, value, options = {}) => {
  const domain = window.location.hostname || "";
  const updatedOptions = {
    expires: 30,  // In days
    ...options
  }
  cookie.set(key, value, { domain, ...updatedOptions });
  return;
};

export const cookieGet = (key) => {
  return cookie.get(key);
};

export const cookieRemove = (key, options = {}) => {
  const domain = window.location.hostname || "";
  cookie.remove(key, { domain, ...options });
  return;
};


export const sessionSave = (key,obj='') =>{
  if(typeof sessionStorage !== 'undefined'){
      if(!obj){
        let tempVal;
        try{
          tempVal = JSON.parse(sessionStorage.getItem(key));
        }catch(e){
          tempVal = sessionStorage.getItem(key);
        }
          return tempVal
      }
      else{
      sessionStorage.setItem(key,JSON.stringify(obj));
    }
  }
}