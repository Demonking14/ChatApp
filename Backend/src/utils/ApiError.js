class ApiError extends Error{
   constructor(
    statusCode , 
    message = "", 
    error = null, 
    stack,
   ){
    super(message);
    this.statusCode = statusCode,
    this.error = error
    if(stack){
        this.stack = stack
    }else{
        Error.captureStackTrace(this , this.constructor);

    }
   }
    



}
export default ApiError