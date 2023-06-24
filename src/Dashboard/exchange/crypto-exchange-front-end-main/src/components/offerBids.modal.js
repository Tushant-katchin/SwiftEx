import { useEffect, useState } from 'react'
import { authRequest, GET, POST } from '../api'
import { StyleSheet, Text, View,  Button, TouchableOpacity, ScrollView} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Modal2 from "react-native-modal";
import { ActivityIndicator, DataTable } from 'react-native-paper'
import { OFFER_STATUS_ENUM } from '../utils/constants'
import { PATCH } from '../api';
export const OfferBidsView = ({ offer, self = false , setChange}) => {
  const [modalMessage, setModalMessage] = useState('')
  const [bids, setBids] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const[loading,setLoading] = useState(false)

  const[open,setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    getOfferDetails()
  }, [])
  useEffect(() => {
    getOfferDetails()
  }, [open,loading,isSubmitting,isCancelling])

  const getOfferDetails = async () => {
    try {
      const { err, res } = await authRequest(
        `/offers/getOfferDetails/${offer._id}`,
        GET,
      )
      if (err) return setModalMessage(`${err.message}`)
      setBids(res.offerBids)
    } catch (err) {
      console.log(err)
      setModalMessage(err.message || 'Something went wrong')
    }
  }

  const acceptBid = async (bid) => {
    setChange(true)
    try {
      setIsSubmitting(true)
      const { err } = await authRequest(`/offers/acceptABid`, POST, {
        offerId: offer._id,
        bidId: bid._id,
      })
      if (err){
        alert(`${err.message}`)
        setLoading(false)
        return setModalMessage(`${err.message}`)
      } 
      getOfferDetails()
      setModalMessage('success')
      setLoading(false)
      setOpen(false)
      setChange(false)
      return alert('Bid Accepted Successfully')
    } catch (err) {
      console.log(err)
      setLoading(false)

      setModalMessage(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
      setIsSubmitting(false)
      getOfferDetails()
    }
  }

  const cancelBid = async () => {
    try {
      setChange(true)
      setIsCancelling(true)
      const { err } = await authRequest(
        `/offers/cancelMatchedBid/${offer._id}`,
        PATCH
      )
      if (err) return setModalMessage(`${err.message}`)
      getOfferDetails()
      setModalMessage('success')
      setLoading(false)
      setOpen(false)
      return alert('Bid Cancelled Successfully')
    } catch (err) {
      console.log(err)
      setModalMessage(err.message || 'Something went wrong')
      setLoading(false)
      setChange(false)
    } finally {
      setIsCancelling(false)
      setLoading(false)
      getOfferDetails()
    }
  }

  return (
    <>
    <View >
       
        <TouchableOpacity
         style={{width:wp(15), height:hp(3), backgroundColor:'#33B3EA', borderRadius:7, alignItems:'center',justifyContent:"center"}}
         onPress={handleOpen}
         >
         <Text style={{fontSize:13, color:'white'}}>See Bids</Text> 
        </TouchableOpacity>
      
      
       
      <Modal2
        animationIn="slideInRight"
        animationOut="slideOutRight"
        animationInTiming={100}
        animationOutTiming={200}
        isVisible={open}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating
        onBackdropPress={()=>{
          setOpen(false)
        }}
        onBackButtonPress={() => {
          //setShowModal(!showModal);
          setOpen(false)
        }}
        >
          <View style={{
            
      height: hp(50),
      width:wp(80),
      backgroundColor:'#E2808A',
      borderTopRightRadius:10,
      borderTopLeftRadius:10}} >
        <View style={{alignItems:'center'}}>
           <Text > {offer.amount} {offer.assetName} for {offer.pricePerUnit}{' '}
            {offer.currencyName} per unit.</Text>
          </View>
          <Text >{modalMessage}</Text>
          {bids ? (
            <DataTable style={styles.container}>
              <DataTable.Header style={styles.tableHeader}>               
                  <DataTable.Title>Bid Amount</DataTable.Title>
                  <DataTable.Title>Bidder</DataTable.Title>
                  <DataTable.Title>Status</DataTable.Title>
                  {self && <DataTable.Title></DataTable.Title>}
              </DataTable.Header>
                {bids.length ? (
                  bids.map((bid, index) => (
                    <>
                      <DataTable.Row  key={bid._id}>
                        <DataTable.Cell >{bid.pricePerUnit}</DataTable.Cell >
                        <DataTable.Cell >
                          {bid.user.firstName} {bid.user.lastName}
                        </DataTable.Cell >
                        <DataTable.Cell >{bid.status}</DataTable.Cell >
                        {self&& !offer.winnerBid ? (

                          
                          <View>
                          
                          <Button
                            title={'Accept bid'}
                            
                            //loading={isSubmitting}
                            color={'blue'}
                            onPress={async () => {
                              setLoading(true)
                              acceptBid(bid)
                              
                            }}
                            >
                            </Button>
                              </View>
                        ): self && bid._id === offer.winnerBid &&
                              offer.status === OFFER_STATUS_ENUM.MATCHED ? (
                                <View>
                                <Button
                                title={'Cancel bid'}
                                color={'red'}
                                  //loading={isCancelling}
                                  onPress={async () =>{
                                    setLoading(true)
                                    cancelBid()
                                    
                                  }
                                  }
                                >
                                  Cancel Bid
                                </Button>
                                </View>
                            ) : (
                              <View>

                                <Button title='No actions'
                                color={'blue'}>No Actions</Button>
                                </View>
                            
                            )
                            }
                            
                            </DataTable.Row >
                    </>
                  ))
                  ) :  (
                    <DataTable.Row>
                    <DataTable.Cell >No bids found</DataTable.Cell >
                  </DataTable.Row>
                )}
                {loading?<ActivityIndicator size={'large'} color={'blue'} />:<View></View>}
            </DataTable>
          ) : (
            <Text>Loading...</Text>
            )}
            {loading?<ActivityIndicator size={'large'} color={'blue'} />:<View></View>}
            </View>
      </Modal2>
            </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width:wp(80),
    height:hp(70),
    color:'black'
  },
  scrollView:{
    width:wp(90),
  },
  tableHeader: {
    backgroundColor: '#DCDCDC',
  },
  table:{
   
      display:'flex',
      alignContent:'center',
      alignItems:'center',
      textAlign:'center',
      color:'black'
    
  },
  content:{
    display:'flex',
    alignContent:'center',
    alignItems:'center',
    textAlign:'center',
    height:hp(100),
    color:'black'
  },
  
})
