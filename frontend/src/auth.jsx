import mainApi from "./APIs";

let currentUser = null;
let fetchPromise = null;

export function getCurrentUser() {
  if (currentUser) {
    return currentUser;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  const token = localStorage.getItem("access_token");
  if (!token) {
    return null;
  }

  fetchPromise = (async () => {
    try {
      const response = await mainApi.post("/users/me", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status == 200) {
        currentUser = response.data
        console.log(response);
        return currentUser
      }
      localStorage.removeItem("access_token")
    } catch (error) {
      console.error(`Error fetching user ${error}`);
      return null
    }finally{
        fetchPromise = null
    }
    return fetchPromise
  });
}

export function Logout(){
    localStorage.removeItem("access_token")
    currentUser = null
    window.location = "/"
}

export function getToken(){
    return localStorage.getItem("access_token")
}

export function setToken(token){
    localStorage.setItem("access_token",token)
}

export function clearUserCache(){
    currentUser = null
}