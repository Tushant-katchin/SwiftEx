import Snackbar from 'react-native-snackbar';
import { Box, useToast } from 'native-base';


export const ShowToast = (toast,message)=>{
  //const toast = useToast()
  
    return (toast.show({
        placement: "top",
        render: () => {
            return <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                    {message}
                  </Box>;
          }
        })
    )

}

export function alert(type,message){
    console.log(String(message))
    if(typeof(message)!=String){
        message = String(message)
    }
    if(type=='success')
    {

        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor:'green',
            
        });
    }else{
        Snackbar.show({
            text: message,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor:'red'
        });
    }
        
}
