import { Box, useToast } from 'native-base';


export const ShowToast = ({message})=>{
  const toast = useToast()
  
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

