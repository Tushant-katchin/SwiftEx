import { sign } from "react-native-pure-jwt";
import { jwtSecret } from "../constants";
export const genrateAuthToken = (Body) =>{
  const generate =  sign(
        {
          iss: Body,
          exp: new Date().getTime() + 3600 * 1000, // expiration date, required, in ms, absolute to 1/1/1970
          additional: "payload"
        }, // body
        jwtSecret, // secret
        {
          alg: "HS256"
        }
      )
        .then((token)=>{
            console.log(token)
        }) // token as the only argument
        .catch(console.error); // possible errors

        return generate



}