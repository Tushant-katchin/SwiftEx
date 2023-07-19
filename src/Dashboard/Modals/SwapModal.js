import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import "@ethersproject/shims";
import { ethers } from "ethers";
import { getBalance } from "../../components/Redux/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RPC, urls } from "../constants";
import {
  getNonce,
  getGasPrice,
  sendSignedTx,
  getAmountsOut,
  SendTransaction,
  approveSwap,
  isFloat,
  isInteger,
} from "../../utilities/utilities";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Modal2 from "react-native-modal";
import TokenList from "../tokens/TokenList";
import TokenHeader from "../tokens/TokenHeader";
import {
  getETHtoTokenPrice,
  getTokentoEthPrice,
} from "../tokens/swapFunctions";
import { tokenTotokenPrice } from "../tokens/UniswapFunctions";
import tokenList from "../tokens/tokenList.json";
import PancakeList from "../tokens/pancakeSwap/PancakeList.json";
import chooseSwap from "../tokens/chooseSwap.json";
import { getSwapPrice } from "../tokens/pancakeSwap/pancakeFunctions";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import SwapPinModal from "./swapPinModal";
import {
  getBnbTokenBalance,
  getEthTokenBalance,
} from "../../utilities/web3utilities";
import { SwapEthForTokens } from "../tokens/swapFunctions";
import { SwapTokensToTokens, UniSwap } from "../tokens/UniswapFunctions";
import { useBiometricsForSwapTransaction } from "../../biometrics/biometric";
import { alert } from "../reusables/Toasts";

const SwapModal = ({ modalVisible, setModalVisible }) => {
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [balance, setBalance] = useState("");
  const [openChain, setOpenChain] = useState(false);
  const [chooseChain, setChooseChain] = useState([]);
  const [swapType, setSwapType] = useState("");
  const [name, setName] = useState("Swap");
  const [amount, setAmount] = useState("0");
  const [amount2, setAmount2] = useState("0");
  const [visible, setVisible] = useState(false);
  const [Tradevisible, setTradeVisible] = useState(false);
  const [label, setLabel] = useState("");
  const [label2, setLabel2] = useState("");
  const [trade, setTrade] = useState();
  const [walletType, setWalletType] = useState("");
  const [pinViewVisible, setPinViewVisible] = useState(false);
  const state = useSelector((state) => state);
  const [disable, setDisable] = useState(true);
  const [message, setMessage] = useState("");
  const [coin0, setCoin0] = useState({
    name: "Token1",
    address: "",
    symbol: "",
    ChainId: "",
  });
  const [coin1, setCoin1] = useState({
    name: "Token2",
    address: "",
    symbol: "",
    ChainId: "",
  });
  const [tradePrice, setTradePrice] = useState({
    token1totoken2: "0",
    token2totoken1: "0",
  });
  const [Data, setData] = useState([]);
  const [coinType, setCoinType] = useState();
  const navigation = useNavigation();
  console.log(state.wallet);

  const dispatch = useDispatch();

  const SaveTransaction = async (type, hash, walletType, chainType) => {
    const user = await state.user;
    let userTransactions = [];

    await AsyncStorageLib.getItem(`${user}-transactions`).then(
      async (transactions) => {
        console.log(JSON.parse(transactions));
        const data = JSON.parse(transactions);
        if (data) {
          data.map((item) => {
            userTransactions.push(item);
          });
          console.log(userTransactions);
          let txBody = {
            hash,
            type,
            walletType,
            chainType,
          };
          userTransactions.push(txBody);
          await AsyncStorageLib.setItem(
            `${user}-transactions`,
            JSON.stringify(userTransactions)
          );
          return userTransactions;
        } else {
          let transactions = [];
          let txBody = {
            hash,
            type,
            walletType,
            chainType,
          };
          transactions.push(txBody);
          await AsyncStorageLib.setItem(
            `${user}-transactions`,
            JSON.stringify(transactions)
          );
          return transactions;
        }
      }
    );
  };

  const pancakeSwap = async (decrypt) => {
    setLoading(true);
    setVisible(false);
    const token = await state.token;

    const Wallet = await state.wallet.address;
    if (!Wallet) {
      return alert("error", "please select a wallet first");
    }
    if (!amount || !coin0.address || !coin1.address) {
      setLoading(false);

      return alert("error", "All places are mandatory");
    }

    /*if(balance<=0){
          setLoading(false)
          console.log(balance)
          return alert('You do not have enough balance to make this transaction')
        }
      
        if(amount>=balance){
          setLoading(false)
          console.log(balance)
          return alert('You do not have enough balance to make this transaction')
        }
      
        
        if(token1===token2){
          setLoading(false)
          return alert('Same tokens cannot be swaped')
        }*/

    const addresses = {
      WBNB: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
      bnb: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      BUSD: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
      USDT: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
      DAI: "0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867",
      ETH: "0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378",
      factory: "0x182859893230dC89b114d6e2D547BFFE30474a21",
      router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
    };

    let address1 = coin0.address;
    let address2 = coin1.address;
    console.log(address1);

    console.log(address2);
    const PRIVATE_KEY = decrypt;

    const provider = new ethers.providers.JsonRpcProvider(RPC.BSCRPC2);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(wallet);
    const gasPrice = await provider.getGasPrice();

    // const amountIn = (await ethers).utils.parseUnits(input.amount, "ether");
    const gas = {
      gasPrice: gasPrice,
      gasLimit: "500000",
    };

    const amountIn = (await ethers).utils.parseUnits(amount, "ether");

    // console.log(Contract)
    try {
      if (coin0.symbol == "BNB") {
        const type = "BNBTOTOKEN";

        console.log("starting");
        const RouterABI = [
          "function swapExactETHForTokens( uint256 amountOutMin, address[] calldata path, address to, uint256 deadline ) external payable virtual returns (uint256[] memory amounts)",
          "function swapExactETHForTokensSupportingFeeOnTransferTokens( uint256 amountOutMin, address[] calldata path, address to, uint256 deadline ) external payable virtual",
        ];

        const pancakeRouterContract = new ethers.Contract(
          addresses.router,
          RouterABI
        );
        // const amounts = await router.getAmountsOut(amountIn, [addresses.WBNB, address2]);
        const amountOutMin = await getAmountsOut(
          amountIn,
          address1,
          address2,
          type
        );

        const nonce = await provider.getTransactionCount(wallet.address); // get from '/getNonce' route
        const gasLimit = 500000;
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

        const unsignedTx =
          await pancakeRouterContract.populateTransaction.swapExactETHForTokens(
            amountOutMin,
            [addresses.WBNB, address2],
            wallet.address,
            deadline,
            {
              nonce,
              gasPrice,
              gasLimit,
              value: amountIn,
            }
          );

        const signedTx = await wallet.signTransaction(unsignedTx);
        console.log(signedTx);
        const tx = await provider.sendTransaction(signedTx); //SendTransaction(signedTx,token)
        // const txx = await tx.wait()
        console.log(tx);
        if (tx.hash) {
          const type = "Swap";
          try {
            const chainType = "BSC";
            const saveTransaction = await SaveTransaction(
              type,
              tx.hash,
              walletType,
              chainType
            );
            console.log(saveTransaction);
            // await getCustomBalance()
            alert("success", "Your Tx Hash : " + tx.hash);
            navigation.navigate("Transactions");
          } catch (e) {
            alert("error", e);
            console.log(e);
          }
        } else {
          alert("error", "transaction failed");
        }
      } else if (coin1.symbol === "BNB") {
        const type = "TOKENTOBNB";
        const approve = await approveSwap(address1, amountIn, decrypt, token);
        console.log(approve);
        console.log("starting swap to bnb");
        const wallet = new ethers.Wallet(PRIVATE_KEY);

        const RouterABI = [
          "function swapExactTokensForETH( uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline ) external virtual returns (uint256[] memory amounts)",
          "function swapExactTokensForETHSupportingFeeOnTransferTokens( uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external virtual",
        ];

        const pancakeRouterContract = new ethers.Contract(
          addresses.router,
          RouterABI
        );

        const amountsOutMin = await getAmountsOut(
          amountIn,
          address1,
          address2,
          type
        );

        const nonce = await provider.getTransactionCount(wallet.address); // get from '/getNonce' route
        // get from '/getNonce' route
        const gasPrice = provider.getGasPrice(); // get from '/getGasPrice' route
        const gasLimit = 500000;
        const DEADLINE = Math.floor(Date.now() / 1000) + 60 * 10;

        const unsignedTx =
          await pancakeRouterContract.populateTransaction.swapExactTokensForETH(
            amountIn,
            amountsOutMin,
            [address1, addresses.WBNB],
            wallet.address,
            DEADLINE,
            {
              nonce,
              gasPrice,
              gasLimit,
            }
          );

        const signedTx = await wallet.signTransaction(unsignedTx);
        console.log(signedTx);
        const Tx = await provider.sendTransaction(signedTx); //SendTransaction(signedTx,token)
        //const tx = await sendSignedTx.wait()
        // console.log(tx.Hash)
        if (Tx.hash) {
          const type = "Swap";
          const chainType = "BSC";
          const saveTransaction = await SaveTransaction(
            type,
            Tx.hash,
            walletType,
            chainType
          );
          console.log(saveTransaction);
          //await getCustomBalance()
          alert("success", "Your Tx Hash : " + Tx.hash);
          navigation.navigate("Transactions");
        } else {
          alert("error", "Swap failed");
        }
      } else {
        const type = "TOKENTOTOKEN";

        const approve = await approveSwap(address1, amountIn, decrypt, token);
        console.log(approve);

        const RouterABI = [
          "function swapExactTokensForTokens( uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external virtual returns (uint256[] memory amounts)",
          "function swapExactTokensForTokensSupportingFeeOnTransferTokens( uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external virtual returns (uint256[] memory amounts)",
        ];

        const pancakeRouterContract = new ethers.Contract(
          addresses.router,
          RouterABI
        );
        const amountsOutMin = getAmountsOut(amountIn, address1, address2, type);

        const nonce = await provider.getTransactionCount(wallet.address); // get from '/getNonce' route
        // get from '/getNonce' route
        const gasPrice = provider.getGasPrice();
        const gasLimit = 500000;
        const DEADLINE = Math.floor(Date.now() / 1000) + 60 * 10;

        const unsignedTx =
          await pancakeRouterContract.populateTransaction.swapExactTokensForTokens(
            amountIn,
            amountsOutMin,
            [address1, address2],
            wallet.address,
            DEADLINE,
            {
              nonce,
              gasPrice,
              gasLimit,
            }
          );

        const signedTx = await wallet.signTransaction(unsignedTx);
        console.log(signedTx);
        const Tx = await provider.sendTransaction(signedTx); //SendTransaction(signedTx,token)
        console.log(Tx.hash);
        if (Tx.hash) {
          const type = "Swap";
          const chainType = "BSC";
          const saveTransaction = await SaveTransaction(
            type,
            Tx.hash,
            walletType,
            chainType
          );
          console.log(saveTransaction);
          //await getCustomBalance()
          alert("success", "Your Tx Hash : " + Tx.hash);
          navigation.navigate("Transactions");
        } else {
          alert("error", "Swap failed");
        }
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
      alert(e);
    }
    setLoading(false);
  };

  async function swapTokens() {
    try {
      setLoading(true);
      const walletType = await AsyncStorage.getItem("walletType");
      console.log(JSON.parse(walletType));
      const Wallet = await state.wallet;
      console.log(Wallet);
      if (JSON.parse(walletType) === "Ethereum") {
        if (Wallet) {
          if (coin0.symbol === "WETH") {
            await SwapEthForTokens(
              Wallet.privateKey,
              Wallet.address,
              coin1.address,
              amount
            )
              .then(async (response) => {
                console.log(response);
                if (response) {
                  if (response.code === 400) {
                    return alert("error", "server error please try again");
                  } else if (response.code === 401) {
                    console.log(response);
                    const type = "Swap";
                    const wallettype = JSON.parse(walletType);
                    const chainType = "Eth";
                    await SaveTransaction(
                      type,
                      response.tx.transactionHash,
                      wallettype,
                      chainType
                    )
                      .then((resp) => {
                        setLoading(false);
                        setTradeVisible(false);
                        setModalVisible(false);
                        alert(
                          "success",
                          "Your Tx Hash : " + response.tx.transactionHash
                        );
                        navigation.navigate("Transactions");
                      })
                      .catch((e) => {
                        setLoading(false);
                        alert("error", e.message);
                        console.log(e);
                      });
                  } else if (response.code === 404) {
                    setLoading(false);
                    setTradeVisible(false);
                    return alert("error", "pair not found");
                  } else {
                    setLoading(false);
                    setTradeVisible(false);
                    return alert("error", response);
                  }
                } else {
                  setLoading(false);
                  setTradeVisible(false);
                  return alert("success", "server error");
                }
              })
              .catch((e) => {
                setLoading(false);
                setTradeVisible(false);
                alert("error", e.message);
                console.log(e);
              });
          } else if (coin1.symbol === "WETH") {
            await UniSwap(
              Wallet.privateKey,
              Wallet.address,
              coin0.address,
              amount
            )
              .then(async (response) => {
                console.log(response);
                if (response) {
                  if (response.code === 401) {
                    console.log("Your Tx Hash : " + response.tx);
                    const type = "Swap";
                    const wallettype = JSON.parse(walletType);
                    const chainType = "Eth";
                    await SaveTransaction(
                      type,
                      response.tx,
                      wallettype,
                      chainType
                    )
                      .then((resp) => {
                        setLoading(false);
                        setTradeVisible(false);
                        setModalVisible(false);
                        setPinViewVisible(false);
                        alert("success", "Your Tx Hash : " + response.tx);
                        navigation.navigate("Transactions");
                      })
                      .catch((e) => {
                        setLoading(false);
                        setTradeVisible(false);
                        alert("error", e.message);
                        console.log(e);
                      });
                  } else if (response.code === 400) {
                    setLoading(false);
                    return alert(
                      "error",
                      "error while swapping. please try again"
                    );
                  } else if (response === 404) {
                    setLoading(false);
                    setTradeVisible(false);
                    return alert("error", "pair not found");
                  } else {
                    setLoading(false);
                    setTradeVisible(false);
                    return alert("error", response);
                  }
                } else {
                  setLoading(false);
                  setTradeVisible(false);
                  return alert("error", "server error");
                }
              })
              .catch((e) => {
                setLoading(false);
                setTradeVisible(false);
                console.log(e);
              });
          } else {
            await SwapTokensToTokens(
              Wallet.privateKey,
              Wallet.address,
              coin0.address,
              coin1.address,
              amount
            )
              .then(async (response) => {
                console.log(response);
                if (response) {
                  if (response.code == 401) {
                    console.log(response);
                    const type = "Swap";
                    const wallettype = JSON.parse(walletType);
                    const chainType = "Eth";
                    const saveTransaction = await SaveTransaction(
                      type,
                      response.tx,
                      wallettype,
                      chainType
                    )
                      .then((resp) => {
                        setLoading(false);
                        setTradeVisible(false);
                        setModalVisible(false);
                        alert("success", "Your Tx Hash : " + response.tx);
                        navigation.navigate("Transactions");
                      })
                      .catch((e) => {
                        setLoading(false);
                        setTradeVisible(false);
                        alert("error", e.message);
                        console.log(e);
                      });
                  } else if (response === 404) {
                    setLoading(false);
                    setTradeVisible(false);
                    return alert("error", "pair not found");
                  } else {
                    setLoading(false);
                    setTradeVisible(false);
                    return alert("error", response);
                  }
                } else {
                  setLoading(false);
                  setTradeVisible(false);
                  return alert("error", "server error");
                }
              })
              .catch((e) => {
                setLoading(false);
                setTradeVisible(false);
                alert(e.message);
                console.log(e);
              });
          }
        } else {
          setLoading(false);
          alert("error", "no wallets found");
        }
      } else if (JSON.parse(walletType) === "BSC") {
        const swap = await pancakeSwap(Wallet.privateKey);
        setLoading(false);
        setModalVisible(false);
        setTradeVisible(false);
      } else if (JSON.parse(walletType) === "Multi-coin") {
        if (swapType === "ETH") {
          if (Wallet) {
            if (coin0.symbol === "WETH") {
              await SwapEthForTokens(
                Wallet.privateKey,
                Wallet.address,
                coin1.address,
                amount
              )
                .then(async (response) => {
                  console.log(response);
                  if (response) {
                    if (response.code === 400) {
                      return alert("error", "server error please try again");
                    } else if (response.code === 401) {
                      console.log(response);
                      const type = "Swap";
                      const wallettype = JSON.parse(walletType);
                      const chainType = "Eth";
                      await SaveTransaction(
                        type,
                        response.tx.transactionHash,
                        wallettype,
                        chainType
                      )
                        .then((resp) => {
                          setLoading(false);
                          setTradeVisible(false);
                          setModalVisible(false);
                          alert(
                            "success",
                            "Your Tx Hash : " + response.tx.transactionHash
                          );
                          navigation.navigate("Transactions");
                        })
                        .catch((e) => {
                          setLoading(false);
                          console.log(e);
                        });
                    } else if (response.code === 404) {
                      setLoading(false);
                      setTradeVisible(false);
                      return alert("error", "pair not found");
                    } else {
                      setLoading(false);
                      setTradeVisible(false);
                      return alert("success", response);
                    }
                  } else {
                    setLoading(false);
                    setTradeVisible(false);
                    return alert("error", "server error");
                  }
                })
                .catch((e) => {
                  setLoading(false);
                  setTradeVisible(false);
                  alert("success", e.message);
                  console.log(e);
                });
            } else if (coin1.symbol === "WETH") {
              await UniSwap(
                Wallet.privateKey,
                Wallet.address,
                coin0.address,
                amount
              )
                .then(async (response) => {
                  console.log(response);
                  if (response) {
                    if (response.code === 401) {
                      console.log("Your Tx Hash : " + response.tx);
                      const type = "Swap";
                      const wallettype = JSON.parse(walletType);
                      const chainType = "Eth";
                      await SaveTransaction(
                        type,
                        response.tx,
                        wallettype,
                        chainType
                      )
                        .then((resp) => {
                          setLoading(false);
                          setTradeVisible(false);
                          setModalVisible(false);
                          alert("success", "Your Tx Hash : " + response.tx);
                          navigation.navigate("Transactions");
                        })
                        .catch((e) => {
                          setLoading(false);
                          setTradeVisible(false);
                          alert("error", e.message);
                          console.log(e);
                        });
                    } else if (response.code === 400) {
                      setLoading(false);
                      return alert(
                        "error",
                        "error while swapping. please try again"
                      );
                    } else if (response === 404) {
                      setLoading(false);
                      setTradeVisible(false);
                      return alert("error", "pair not found");
                    } else {
                      setLoading(false);
                      setTradeVisible(false);
                      return alert("error", response);
                    }
                  } else {
                    setLoading(false);
                    setTradeVisible(false);
                    return alert("error", "server error");
                  }
                })
                .catch((e) => {
                  setLoading(false);
                  setTradeVisible(false);
                  alert("error", e.message);
                  console.log(e);
                });
            } else {
              await SwapTokensToTokens(
                Wallet.privateKey,
                Wallet.address,
                coin0.address,
                coin1.address,
                amount
              )
                .then(async (response) => {
                  console.log(response);
                  if (response) {
                    if (response.code == 401) {
                      console.log(response);
                      const type = "Swap";
                      const wallettype = JSON.parse(walletType);
                      const chainType = "Eth";
                      const saveTransaction = await SaveTransaction(
                        type,
                        response.tx,
                        wallettype,
                        chainType
                      )
                        .then((resp) => {
                          setLoading(false);
                          setTradeVisible(false);
                          setModalVisible(false);
                          alert("success", "Your Tx Hash : " + response.tx);
                          navigation.navigate("Transactions");
                        })
                        .catch((e) => {
                          setLoading(false);
                          setTradeVisible(false);
                          console.log(e);
                        });
                    } else if (response === 404) {
                      setLoading(false);
                      setTradeVisible(false);
                      return alert("error", "pair not found");
                    } else {
                      setLoading(false);
                      setTradeVisible(false);
                      return alert(response);
                    }
                  } else {
                    setLoading(false);
                    setTradeVisible(false);
                    return alert("error", "server error");
                  }
                })
                .catch((e) => {
                  setLoading(false);
                  setTradeVisible(false);
                  alert("error", e.message);
                  console.log(e);
                });
            }
          } else {
            setLoading(false);
            alert("error", "no wallets found");
          }
        } else if (swapType === "BSC") {
          const swap = await pancakeSwap(Wallet.privateKey);
          setLoading(false);
          setModalVisible(false);
          setTradeVisible(false);
        }
      }
    } catch (e) {
      setLoading(false);
      setTradeVisible(false);
      alert("error", e.message);
      console.log(e);
    }
  }
  useEffect(async () => {
    AsyncStorage.getItem("walletType").then(async (type) => {
      console.log(JSON.parse(type));
      const Type = JSON.parse(type);
      setWalletType(Type);

      if (Type === "Multi-coin") {
        setData(chooseSwap);
        setChooseChain(chooseSwap);
      } else if (Type === "Ethereum") {
        const data = tokenList.reverse();
        // console.log(data)
        setChooseChain(data);
        setData(data);
      } else if (Type === "BSC") {
        const data = PancakeList;
        // console.log(data);
        setChooseChain(data);
        setData(data);
      }
    });

    /* await getPrice(coin0.address,coin1.address)
       .then((response)=>{
        console.log(response)
        setTradePrice(response)

       })*/
  }, []);

  useEffect(async () => {
    AsyncStorage.getItem("walletType").then(async (type) => {
      console.log(JSON.parse(type));
      const Type = JSON.parse(type);
      setWalletType(Type);

      if (Type === "Multi-coin") {
        setData(chooseSwap);
        setChooseChain(chooseSwap);
      } else if (Type === "Ethereum") {
        const data = tokenList.reverse();
        // console.log(data)
        setChooseChain(data);
        setData(data);
      } else if (Type === "BSC") {
        const data = PancakeList;
        console.log(data);
        setChooseChain(data);
        setData(data);
      }
    });

    /* await getPrice(coin0.address,coin1.address)
       .then((response)=>{
        console.log(response)
        setTradePrice(response)

       })*/
  }, [state.wallet]);

  useEffect(async () => {
    console.log(coin0);
    if (coin0.ChainId === 1 || coin0.ChainId === 5) {
      const data = tokenList;
      // console.log(data)
      setData(data);
    } else {
      const data = PancakeList;
      //  console.log(data)
      setData(data);
    }
  }, [coin0.name]);

  useEffect(async () => {
    const walletType = await AsyncStorageLib.getItem("walletType");

    const address = await state.wallet.address;
    console.log(coin0.address);
    console.log(walletType);
    if (JSON.parse(walletType) === "Ethereum") {
      if (coin0.symbol === "WETH") {
        console.log(await state.EthBalance);
        setBalance(await state.EthBalance);
        return;
      } else if (coin0.ChainId === 1 || coin0.ChainId === 5) {
        await getEthTokenBalance(address, coin0.address).then((balance) => {
          console.log("My Token Balance", balance);
          setBalance(balance);
        });
      } else {
        setBalance(0);
      }
    } else if (JSON.parse(walletType) === "BSC") {
      if (coin0.symbol === "BNB") {
        console.log(await state.walletBalance);
        setBalance(await state.walletBalance);
        return;
      } else if (coin0.ChainId === 56) {
        await getBnbTokenBalance(address, coin0.address).then((balance) => {
          console.log(balance);
          setBalance(balance);
        });
      } else {
        setBalance(0);
      }
    } else if (JSON.parse(walletType) === "Multi-coin") {
      if (coin0.ChainId === 56) {
        if (coin0.symbol === "BNB") {
          console.log(await state.walletBalance);
          setBalance(await state.walletBalance);
          return;
        }
        await getBnbTokenBalance(address, coin0.address).then((balance) => {
          console.log(balance);
          setBalance(balance);
        });
      } else if (coin0.ChainId === 1 || coin0.ChainId === 5) {
        if (coin0.symbol === "WETH") {
          console.log(await state.EthBalance);
          setBalance(await state.EthBalance);
          return;
        }
        await getEthTokenBalance(address, coin0.address).then((balance) => {
          console.log("My Token Balance", balance);
          setBalance(balance);
        });
      }
    }
  }, [coin0.address]);

  useEffect(() => {
    let inputValidation;
    let inputValidation1;
    inputValidation = isFloat(amount);
    inputValidation1 = isInteger(amount);

    if (
      coin1.address &&
      coin0.address &&
      amount != 0 &&
      (inputValidation || inputValidation1)
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [coin0, coin1, amount]);

  useEffect(() => {
    let inputValidation;
    let inputValidation1;
    inputValidation = isFloat(amount);
    inputValidation1 = isInteger(amount);

    if (amount != 0) {
      console.log(amount > balance);
      if (amount > balance) {
        setDisable(true);
        setMessage("Low Balance");
      } else if (!inputValidation && !inputValidation1) {
        setMessage("Please enter a valid amount");
      } else {
        setMessage("");
      }
    } else {
      setMessage("");
    }
  }, [amount]);

  return (
    <View
      // style={{ marginTop: hp(50) }}
      onStartShouldSetResponder={() => Keyboard.dismiss()}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating
        statusBarTranslucent={true}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View
          style={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            height: "70%",
            marginTop: "auto",
            backgroundColor: "#131E3A",
          }}
        >
          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={20}
            color={"white"}
            style={{ padding: hp(2) }}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center",
              marginRight:wp(45)
            }}
          >
            Swap
          </Text>

          </View>
          {/* <TokenHeader setVisible={setModalVisible} name={name} /> */}
        

          <View
            style={styles.cardmainContainer}
            onStartShouldSetResponder={() => Keyboard.dismiss()}
          >
            <View style={styles.tokenView}>
              <Text style={styles.color}>{coin0.name}</Text>
              <Text style={styles.color}> Balance:{balance ? balance : 0}</Text>
            </View>
            <View style={styles.tokenView}>
              <TextInput
                keyboardType="numeric"
                onChangeText={(text) => {
                  setAmount(text);
                }}
                placeholder="0"
                placeholderTextColor={"gray"}
                style={styles.textinputCon}
              />
              <Icon
                onPress={() => {
                  setCoinType("0");
                  setOpenChain(true);
                }}
                name={"ios-chevron-forward-circle"}
                size={30}
                color={"black"}
              />
            </View>
          </View>

          <Icon
            name={"swap-vertical"}
            size={30}
            color={"white"}
            style={{ alignSelf: "center", marginTop: hp(1) }}
          />

          <View
            style={styles.cardmainContainer1}
            onStartShouldSetResponder={() => Keyboard.dismiss()}
          >
            <View style={styles.tokenView}>
              <Text style={styles.color}> {coin1.name}</Text>
              <Text style={styles.color}> Balance:{balance ? balance : 0}</Text>
            </View>
            <View style={styles.tokenView}>
              <TextInput
                disabled={true}
                keyboardType="numeric"
                placeholder={trade ? `${trade.minimumAmountOut}` : `0`}
                onChangeText={(text) => {
                  setAmount2(text);
                }}
                placeholderTextColor={"gray"}
                style={{
                  width: wp(50),
                  padding: 4,
                  height: hp(5),
                  borderRadius: hp(1.4),
                  backgroundColor: "white",
                  borderWidth: StyleSheet.hairlineWidth * 2,
                }}
              />
              <Icon
                onPress={() => {
                  setCoinType("1");

                  setVisible(true);
                }}
                name={"ios-chevron-forward-circle"}
                size={30}
                color={"black"}
              />
            </View>
          </View>

          <Text
            style={{
              textAlign: "center",
              marginTop: hp(4),
              fontSize: 16,
              color: "white",
            }}
          >
            {" "}
            {amount} {coin0.name} ={" "}
            {tradePrice ? tradePrice.token1totoken2 : ""} {coin1.name}
          </Text>
          <View
            style={{
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ marginTop: 20, color: "red" }}>{message}</Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: disable ? "grey" : "#000C66",
              width: wp(50),
              padding: hp(1),
              borderRadius: hp(0.6),
              alignItems: "center",
              alignSelf: "center",
            }}
            disabled={disable}
            onPress={async () => {
              //setVisible(true)
              setLoading2(true);
              console.log(coin1.address);
              const token = await state.token;

              const Wallet = await state.wallet;
              console.log(Wallet);
              console.log(amount);
              try {
                if (walletType === "Ethereum") {
                  if (Wallet) {
                    if (coin0.symbol === "WETH") {
                      await getETHtoTokenPrice(coin1.address, amount)
                        .then((resp) => {
                          console.log(resp);
                          if (resp) {
                            console.log(resp);
                            setLoading2(false);
                            setTradePrice({
                              token1totoken2: resp.token1totoken2,
                              token2totoken1: resp.token2totoken1,
                            });
                            setTrade(resp.trade);
                            setTradeVisible(true);
                          }
                        })
                        .catch((e) => {
                          setLoading2(false);
                          console.log(e);
                        });
                    } else if (coin1.symbol === "WETH") {
                      await getTokentoEthPrice(coin0.address, amount)
                        .then((resp) => {
                          console.log(resp);
                          if (resp) {
                            console.log(resp);
                            setTradePrice({
                              token1totoken2: resp.token1totoken2,
                              token2totoken1: resp.token2totoken1,
                            });
                            setTrade(resp.trade);
                            setTradeVisible(true);
                            setLoading2(false);
                          }
                        })
                        .catch((e) => {
                          setLoading2(false);

                          console.log(e);
                        });
                    } else {
                      tokenTotokenPrice(
                        Wallet.address,
                        coin0.address,
                        coin1.address,
                        amount
                      )
                        .then((response) => {
                          console.log(response);
                          setTradePrice({
                            token1totoken2: response.token1totoken2,
                            token2totoken1: response.token2totoken1,
                          });
                          setTrade(response.trade);
                          setTradeVisible(true);
                          setLoading2(false);
                        })
                        .catch((e) => {
                          console.log(e);
                          setLoading2(false);
                          return alert(
                            "error",
                            "error fetching pair prices. please try again"
                          );
                        });
                    }
                  }
                } else if (walletType === "BSC") {
                  let amountIn = (await ethers).utils.parseUnits(
                    amount,
                    "ether"
                  );
                  let type;
                  if (coin0.symbol === "BNB") {
                    type = "BNBTOTOKEN";
                    await getSwapPrice(
                      amountIn,
                      coin0.address,
                      coin1.address,
                      type
                    )
                      .then((response) => {
                        console.log(response);
                        const trade = {
                          slippageTolerance: 1,
                          minimumAmountOut: response.token1totoken2,
                        };
                        console.log(response.token1totoken2);
                        setTradePrice({
                          token1totoken2: response.token1totoken2,
                          token2totoken1: response.token2totoken1,
                        });
                        setTrade(trade);
                        setTradeVisible(true);
                        setLoading2(false);
                      })
                      .catch((e) => {
                        setLoading2(false);
                        console.log(e);
                        alert("error", e);
                      });
                  } else if (coin1.symbol === "BNB") {
                    type = "TOKENTOBNB";
                    await getSwapPrice(
                      amountIn,
                      coin0.address,
                      coin1.address,
                      type
                    )
                      .then((response) => {
                        const trade = {
                          slippageTolerance: 1,
                          minimumAmountOut: response.token1totoken2,
                        };
                        console.log(response.token1totoken2);
                        setTradePrice({
                          token1totoken2: response.token1totoken2,
                          token2totoken1: response.token2totoken1,
                        });
                        setTrade(trade);
                        setTradeVisible(true);
                        setLoading2(false);
                      })
                      .catch((e) => {
                        setLoading2(false);
                        console.log(e);
                        alert("error", e);
                      });
                  } else {
                    type = "TOKENTOTOKEN";
                    const approve = await approveSwap(
                      coin0.address,
                      amountIn,
                      Wallet.privateKey,
                      token
                    ).then(async (next) => {
                      await getSwapPrice(
                        amountIn,
                        coin0.address,
                        coin1.address,
                        type
                      )
                        .then(async (response) => {
                          const trade = {
                            slippageTolerance: 1,
                            minimumAmountOut: response.token1totoken2,
                          };
                          console.log(response.token1totoken2);
                          setTradePrice({
                            token1totoken2: response.token1totoken2,
                            token2totoken1: response.token2totoken1,
                          });
                          setTrade(trade);
                          setTradeVisible(true);
                          setLoading2(false);
                        })
                        .catch((e) => {
                          setLoading2(false);
                          alert(
                            "error",
                            "Insufficient liquidity. please try with a different token"
                          );
                          console.log(e);
                        });
                    });
                    console.log(approve);
                    setLoading2(false);
                  }
                } else if (walletType === "Multi-coin") {
                  if (swapType === "ETH") {
                    if (Wallet) {
                      if (coin0.symbol === "WETH") {
                        await getETHtoTokenPrice(coin1.address, amount)
                          .then((resp) => {
                            console.log(resp);
                            if (resp) {
                              console.log(resp);
                              setLoading2(false);
                              setTradePrice({
                                token1totoken2: resp.token1totoken2,
                                token2totoken1: resp.token2totoken1,
                              });
                              setTrade(resp.trade);
                              setTradeVisible(true);
                            }
                          })
                          .catch((e) => {
                            setLoading2(false);
                            console.log(e);
                          });
                      } else if (coin1.symbol === "WETH") {
                        await getTokentoEthPrice(coin0.address, amount)
                          .then((resp) => {
                            console.log(resp);
                            if (resp) {
                              console.log(resp);
                              setTradePrice({
                                token1totoken2: resp.token1totoken2,
                                token2totoken1: resp.token2totoken1,
                              });
                              setTrade(resp.trade);
                              setTradeVisible(true);
                              setLoading2(false);
                            }
                          })
                          .catch((e) => {
                            setLoading2(false);

                            console.log(e);
                          });
                      } else {
                        tokenTotokenPrice(
                          Wallet.address,
                          coin0.address,
                          coin1.address,
                          amount
                        )
                          .then((response) => {
                            console.log(response);
                            setTradePrice({
                              token1totoken2: response.token1totoken2,
                              token2totoken1: response.token2totoken1,
                            });
                            setTrade(response.trade);
                            setTradeVisible(true);
                            setLoading2(false);
                          })
                          .catch((e) => {
                            console.log(e);
                            setLoading2(false);
                            return alert("error", e.message);
                          });
                      }
                    }
                  } else if (swapType === "BSC") {
                    console.log(coin0.address, coin1.address);
                    let amountIn = (await ethers).utils.parseUnits(
                      amount,
                      "ether"
                    );
                    console.log("My amount", amountIn);
                    let type;
                    if (coin0.symbol === "BNB") {
                      type = "BNBTOTOKEN";
                      await getSwapPrice(
                        amountIn,
                        coin0.address,
                        coin1.address,
                        type
                      )
                        .then((response) => {
                          console.log(response);
                          const trade = {
                            slippageTolerance: 1,
                            minimumAmountOut: response.token1totoken2,
                          };
                          console.log(response);
                          setTradePrice({
                            token1totoken2: response.token1totoken2,
                            token2totoken1:
                              Number(amount) / Number(response.token1totoken2),
                          });
                          setTrade(trade);
                          setTradeVisible(true);
                          setLoading2(false);
                        })
                        .catch((e) => {
                          setLoading2(false);
                          console.log(e);
                          alert("error", e);
                        });
                    } else if (coin1.symbol === "BNB") {
                      type = "TOKENTOBNB";
                      await getSwapPrice(
                        amountIn,
                        coin0.address,
                        coin1.address,
                        type
                      )
                        .then((response) => {
                          const trade = {
                            slippageTolerance: 1,
                            minimumAmountOut: response.token1totoken2,
                          };
                          console.log(response.token1totoken2);
                          setTradePrice({
                            token1totoken2: response.token1totoken2,
                            token2totoken1:
                              Number(amount) / Number(response.token1totoken2),
                          });
                          setTrade(trade);
                          setTradeVisible(true);
                          setLoading2(false);
                        })
                        .catch((e) => {
                          setLoading2(false);
                          console.log(e);
                          alert("error", e);
                        });
                    } else {
                      type = "TOKENTOTOKEN";
                      const approve = await approveSwap(
                        coin0.address,
                        amountIn,
                        Wallet.privateKey,
                        token
                      ).then(async (next) => {
                        await getSwapPrice(
                          amountIn,
                          coin0.address,
                          coin1.address,
                          type
                        )
                          .then(async (response) => {
                            const trade = {
                              slippageTolerance: 1,
                              minimumAmountOut: response.token1totoken2,
                            };
                            console.log(response.token1totoken2);
                            setTradePrice({
                              token1totoken2: response.token1totoken2,
                              token2totoken1:
                                Number(amount) /
                                Number(response.token1totoken2),
                            });
                            setTrade(trade);
                            setTradeVisible(true);
                            setLoading2(false);
                          })
                          .catch((e) => {
                            setLoading2(false);
                            alert(
                              "error",
                              "Insufficient liquidity. please try with a different token"
                            );
                            console.log(e);
                          });
                      });
                      console.log(approve);
                      setLoading2(false);
                    }
                  }
                } else {
                  return alert("error", "Swap not supported for chain");
                }
              } catch (e) {
                setLoading2(false);
              }
            }}
          >
            <Text style={styles.addButtonText}>
              {loading2 ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                "Swap"
              )}
            </Text>
          </TouchableOpacity>
        </View>
        <Modal2
          animationIn="slideInRight"
          animationOut="slideOutRight"
          animationInTiming={100}
          animationOutTiming={200}
          isVisible={openChain}
          useNativeDriver={true}
          useNativeDriverForBackdrop={true}
          backdropTransitionOutTiming={0}
          hideModalContentWhileAnimating
          onBackButtonPress={() => {
            //setShowModal(!showModal);
            setOpenChain(false);
          }}
        >
          <View
            style={{
              height: hp(98),
              width: wp(99),
              backgroundColor: "#ddd",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              marginTop: hp(5),
              left: wp(-4.5),
            }}
          >
            <TokenList
              setVisible={setOpenChain}
              setCoin0={setCoin0}
              setCoin1={setCoin1}
              data={chooseChain}
              coinType={coinType}
              walletType={walletType}
              setSwapType={setSwapType}
            />
          </View>
        </Modal2>
        <Modal2
          animationIn="slideInRight"
          animationOut="slideOutRight"
          animationInTiming={100}
          animationOutTiming={200}
          isVisible={visible}
          useNativeDriver={true}
          useNativeDriverForBackdrop={true}
          backdropTransitionOutTiming={0}
          hideModalContentWhileAnimating
          onBackButtonPress={() => {
            //setShowModal(!showModal);
            setVisible(false);
          }}
        >
          <View
            style={{
              height: hp(98),
              width: wp(99),
              backgroundColor: "#ddd",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              marginTop: hp(5),
              left: wp(-4.5),
            }}
          >
            <TokenList
              setVisible={setVisible}
              setCoin0={setCoin0}
              setCoin1={setCoin1}
              data={Data}
              coinType={coinType}
              walletType={walletType}
              setSwapType={setSwapType}
            />
          </View>
        </Modal2>

        <Modal2
          animationIn="slideInRight"
          animationOut="slideOutRight"
          animationInTiming={500}
          animationOutTiming={650}
          isVisible={Tradevisible}
          useNativeDriver={true}
          useNativeDriverForBackdrop={true}
          backdropTransitionOutTiming={0}
          hideModalContentWhileAnimating
          onBackdropPress={() => setTradeVisible(false)}
          onBackButtonPress={() => {
            setTradeVisible(false);
          }}
        >
          <View
            style={{
              height: hp(50),
              width: wp(70),
              backgroundColor: "#ddd",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              marginTop: hp(5),
              left: wp(10),
            }}
          >
            <View
              style={{
                display: "flex",
                alignItems: "center",
                alignContent: "center",
                marginTop: hp(10),
              }}
            >
              <Text style={{ marginTop: hp(2) }}>
                slippageTolerance:{trade ? trade.slippageTolerance : 0} %
              </Text>
              <Text style={{ marginTop: hp(2) }}>
                amount : {amount ? amount : 0} {coin0.name}
              </Text>
              <Text style={{ marginTop: hp(2) }}>
                {" "}
                You get : {trade ? trade.minimumAmountOut : 0} {coin1.name}
              </Text>

              <TouchableOpacity
                disabled={loading === true ? true : false}
                style={styles.addButton3}
                onPress={() => {
                  setTimeout(async () => {
                    const biometric = await AsyncStorageLib.getItem(
                      "Biometric"
                    );
                    console.log("Biometric =", biometric);
                    if (biometric === "SET") {
                      try {
                        await useBiometricsForSwapTransaction(swapTokens);
                        return;
                      } catch (e) {
                        console.log(e);
                      }
                    }
                    if (Number(amount) >= Number(balance)) {
                      return alert(
                        "error",
                        "You Don't have enough balance to do this transaction"
                      );
                    }
                    setPinViewVisible(true);
                  }, 0);
                }}
              >
                <Text style={styles.addButtonText}>
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    "Confirm"
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <SwapPinModal
            pinViewVisible={pinViewVisible}
            setPinViewVisible={setPinViewVisible}
            setModalVisible={setModalVisible}
            setTradeVisible={setTradeVisible}
            pancakeSwap={pancakeSwap}
            coin0={coin0}
            coin1={coin1}
            SaveTransaction={SaveTransaction}
            swapType={swapType}
            setLoading={setLoading}
            amount={amount}
          />
        </Modal2>
      </Modal>
    </View>
  );
};

export default SwapModal;

const styles = StyleSheet.create({
  Amount: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "black",
    fontSize: 18,
    padding: 26,
  },
  noteHeader: {
    backgroundColor: "#42f5aa",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  footer: {
    flex: 1,
    backgroundColor: "#ddd",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "grey",
    width: 390,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    height: 40,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },

  textInput2: {
    borderWidth: 1,
    borderColor: "grey",
    width: 200,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    height: 50,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },

  addButton: {
    position: "absolute",
    zIndex: 11,
    right: 20,
    bottom: 10,
    backgroundColor: "red",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  addButton2: {
    position: "absolute",
    zIndex: 11,
    left: wp(10),
    bottom: hp(23),
    backgroundColor: "#000C66",
    width: wp(80),
    height: 70,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  addButton3: {
    top: hp(5),
    backgroundColor: "#000C66",
    width: wp(40),
    height: 70,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  container: {
    backgroundColor: "#ddd",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "#ddd",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  tokenView: {
    padding: hp(2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: wp(80),
  },
  cardmainContainer1: {
    // backgroundColor:"red"
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 4,
    shadowRadius: wp(1),
    overflow: "hidden",
    shadowOpacity: 0.2,
    shadowColor: "#000",
    backgroundColor: "white",
    borderColor: "rgba(238, 227, 232,1)",

    width: wp(93),
    borderRadius: hp(2),
    alignSelf: "center",
    marginTop: hp(1),
  },
  cardmainContainer: {
    // backgroundColor:"red"
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 4,
    shadowRadius: wp(1),
    overflow: "hidden",
    shadowOpacity: 0.2,
    shadowColor: "#000",
    backgroundColor: "white",
    borderColor: "rgba(238, 227, 232,1)",

    width: wp(93),
    borderRadius: hp(2),
    alignSelf: "center",
    marginTop: hp(4),
  },
  color: {
    color: "black",
  },
  textinputCon: {
    width: wp(50),
    padding: 4,
    height: hp(5),
    borderRadius: hp(1.4),
    backgroundColor: "white",
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
});
