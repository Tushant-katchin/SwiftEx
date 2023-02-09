import { LinearProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { authRequest, GET } from '../api'
import { Navbar } from '../components/nav'
import { NewBidModal } from '../components/newBid.modal'
import { OfferBidsView } from '../components/offerBids.modal'
import RefreshIcon from '@mui/icons-material/Refresh'
import { DataTable } from 'react-native-paper'
import { StyleSheet, Text, View,  Button, TouchableOpacity, ScrollView} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Provider as PaperProvider } from 'react-native-paper';

const numberOfItemsPerPageList = [3];
export const OfferListView = ({ self = false, offers, profile }) => {

  const[open,setOpen] = useState(false)

  return (
    <PaperProvider >
      <DataTable style={styles.container}>
      
        <DataTable.Header style={styles.tableHeader}>
        <DataTable.Title>Asset</DataTable.Title>
        <DataTable.Title>Amount</DataTable.Title>
        <DataTable.Title>Price</DataTable.Title>
        <DataTable.Title>Total Price</DataTable.Title>
        <DataTable.Title>Currency</DataTable.Title>
        <DataTable.Title>Status</DataTable.Title>
        </DataTable.Header>
        <ScrollView >

          {offers?offers.map((offer) => {
            if (self)
              return (
                offer.issuer === profile._id && (
                  <>
                  <View  key={offer._id}>
                  <ScrollView key={offer._id}>
                  <DataTable.Row key={offer._id}>
                  <DataTable.Cell >{offer.assetName}</DataTable.Cell>

                    <DataTable.Cell>{offer.amount}</DataTable.Cell>
                    <DataTable.Cell>{offer.pricePerUnit}</DataTable.Cell>
                    <DataTable.Cell>{offer.totalPrice}</DataTable.Cell>
                    <DataTable.Cell>{offer.currencyName}</DataTable.Cell>
                    <DataTable.Cell>{offer.status}</DataTable.Cell>
                   
                  </DataTable.Row>
                  </ScrollView>
                  <OfferBidsView offer={offer} self={self} />
                  </View>
                  </>
                
              )
              )
            return (
              offer.issuer !== profile._id && (
                <>
                <ScrollView style={styles.scrollView} >

                <DataTable.Row key={offer._id}>
                <DataTable.Cell>{offer.assetName}</DataTable.Cell>
                    <DataTable.Cell>{offer.amount}</DataTable.Cell>
                    <DataTable.Cell>{offer.pricePerUnit}</DataTable.Cell>
                    <DataTable.Cell>{offer.totalPrice}</DataTable.Cell>
                    <DataTable.Cell>{offer.currencyName}</DataTable.Cell>
                    <DataTable.Cell>{offer.status}</DataTable.Cell>
                </DataTable.Row>
                <View style={{display:'flex', flexDirection:'row'}}>
                  <View style={{marginLeft:10}}>
                    <OfferBidsView offer={offer}  />
                  </View>
                  <View style={{marginLeft:10}}>
                    <NewBidModal offer={offer} />
                    </View>
                </View>
                </ScrollView>
                </>
              )
            )
          }):<View></View>}
          </ScrollView>
      </DataTable>
      
    </PaperProvider>
  )
}

export const OfferView = (props) => {
  const [message, setMessage] = useState()
  const [offers, setOffers] = useState()
  const [profile, setProfile] = useState({
    isVerified:false,
    firstName:'tushant',
    lastName:'chakravarty',
    email:'tushant@gmail.com',
    phoneNumber:'9340079982',
    isEmailVerified:true
  })
  const [searchParams] = useSearchParams()
  const [paymentFollowUp, setPaymentFollowUp] = useState(false)
  const [txLink, setTxLink] = useState(null)
  const [refreshTx, setRefreshTx] = useState(false)
  
  useEffect(() => {
    getOffersData()
    fetchProfileData()
  }, [])

  useEffect(() => {
    if (searchParams) {
      const sessionId = searchParams.get('session_id')
      if (sessionId) {
        fetchTransactionData(sessionId)
      }
    }
  }, [searchParams])

  const getOffersData = async () => {
    try {
      const { res, err } = await authRequest('/offers', GET)
      if (err) return setMessage(`${err.status}: ${err.message}`)
      setOffers(res)
    } catch (err) {
      console.log(err)
      setMessage(err.message || 'Something went wrong')
    }
  }

  const fetchProfileData = async () => {
    try {
      const { res, err } = await authRequest('/users/getUserDetails', GET)
      if (err) return setMessage(`${err.status}: ${err.message}`)
      console.log(res)
      setProfile(res)
    } catch (err) {
      console.log(err)
      setMessage(err.message || 'Something went wrong')
    }
  }

  const fetchTransactionData = async (sessionId) => {
    try {
      setPaymentFollowUp(true)
      const { res, err } = await authRequest(
        `/transactions/transactionDetails/${sessionId}`,
        GET,
      )
      if (err) return setMessage(`${err.status}: ${err.message}`)
      const { status, cryptoTxHash } = res
      if (status === 'PAYMENT_PENDING') return setRefreshTx(true)
      if (cryptoTxHash)
        setTxLink(`https://goerli.etherscan.io/tx/${cryptoTxHash}`)
      setRefreshTx(false)
    } catch (err) {
      console.log(err)
      setMessage(err.message || 'Something went wrong')
    } finally {
      setPaymentFollowUp(false)
    }
  }

  return (
    <>
    <View style={styles.content}>
      <Text>{message}</Text>
      <Text>{paymentFollowUp?<LinearProgress />:''}</Text>
      {txLink?(
        <View >
          <TouchableOpacity>

          <Text>

          Your transaction is successfully completed
          {txLink}
            click here
         
          to see it.
          </Text>
          </TouchableOpacity>
        </View>
      ):<Text></Text>}

      {refreshTx ? (
        <RefreshIcon
        onClick={() => fetchTransactionData(searchParams.get('session_id'))}
        ></RefreshIcon>
        ):<View></View>}
        

        <View style={styles.table}>

         <OfferListView
        offers={offers}
        profile={profile}
        setMessage={setMessage}
        />

        </View>
</View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width:wp(100),
    height:hp(80),
    color:'black'
  },
  scrollView:{
    width:wp(100),
  },
  tableHeader: {
    backgroundColor: '#DCDCDC',
    width:wp(100)
  },
  table:{
   
      display:'flex',
      alignContent:'center',
      alignItems:'center',
      textAlign:'center',
    
  },
  content:{
    display:'flex',
    alignContent:'center',
    alignItems:'center',
    textAlign:'center',
    height:hp(100)
  }
})
