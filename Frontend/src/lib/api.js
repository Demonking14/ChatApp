import axiosInstance from "./axios";
export const signup = async(signupdata)=>{
     const response = await axiosInstance.post("/auth/signup" , signupdata);
      return response.data
}

export const getAuthUser = async()=>{
    try {
        const res = await axiosInstance.get("/auth/me");
  //      console.log(res.data)
      
        return res.data;
    } catch (error) {
      return null;
      
    }
    }

export const completeOnBoarding = async(data)=>{
      const res = await axiosInstance.patch("/auth/onBoard" , data);
      return res.data;
}

export const login = async(loginData)=>{
     const response = await axiosInstance.post("/auth/login" , loginData);
      return response.data
}
export const logout = async()=>{
     const response = await axiosInstance.post("/auth/logout");
      return response.data
}

export const getUserFriends = async()=>{
      const response = await axiosInstance.get("/user/friends");
      
      return response.data
}

export const getRecommendedUser = async()=>{
      const response = await axiosInstance.get("/user/recommendUser");
      return response.data
}

export const sendFriendRequest = async(userId) =>{
      const response = await axiosInstance.post(`/user/send-friend-request/${userId}`);
      return response.data
}
export const getOutgoingFriendReq = async() =>{
      const response = await axiosInstance.get('/user/ongoing-requests');
      return response.data
}


export const getFriendRequest = async()=>{
      const response = await axiosInstance.get('/user/incoming-requests');
      return response.data;
}
export const acceptFriendRequest = async(requestId) =>{
       if (!requestId) throw new Error("Request ID is missing");
      const response = await axiosInstance.put(`/user/accept-friend-request/${requestId}`);
      return response.data;
}

export const getStreamToken = async()=>{
      const response = await axiosInstance.get('/chat/streamtoken');
      return response.data;
}