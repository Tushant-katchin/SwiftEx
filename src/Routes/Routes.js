import React from 'react'
import { Router, Scene } from 'react-native-router-flux'
import Register from '../../Register'
import Home from '../../Home'

const Routes = () => (
   <Router>
      <Scene key = "root">
         <Scene key = "Register" component = {Register} title = "Register" initial = {true} />
         <Scene key = "Main" component = {Home} title = "Main" />
      </Scene>
   </Router>
)
export default Routes