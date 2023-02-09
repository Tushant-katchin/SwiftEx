import { getAuth} from "./api";
import { StyleSheet, Text, View} from "react-native";
import ExchangeRoutes from "./exchangeRoutes";



const ExchangeApp = () =>{
    const isAuth = getAuth()

    if(isAuth){
        return(
            <ExchangeRoutes/>
        )
       
    }
            return(
                <ExchangeLogin/>
            )
        

}

