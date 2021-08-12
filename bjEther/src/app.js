App = {
   contracts: {},
   web3Provider: null,
   balance: 0,
   tokenPrice: 1000000000000000,

   load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.handleEvents()
      await App.render()
   },

   // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
   loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
         App.web3Provider = web3.currentProvider
         web3 = new Web3(web3.currentProvider)
      } else {
         window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
         window.web3 = new Web3(ethereum)
         try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
         } catch (error) {
            // User denied account access...
         }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
         App.web3Provider = web3.currentProvider
         window.web3 = new Web3(web3.currentProvider)
         // Acccounts always exposed
         web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
         console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
   },

   loadAccount: async () => {
      // Set the current blockchain account
      // let search = location.search.substring(1);
      // let params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

      App.account = web3.eth.accounts[0]
      console.log(web3.eth.accounts.length)

      web3.eth.defaultAccount = App.account
   },

   loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const bjTokenGameInst = await $.getJSON('BJTokenGame.json')
      App.contracts.BJTokenGame = TruffleContract(bjTokenGameInst)
      App.contracts.BJTokenGame.setProvider(App.web3Provider)

      // Hydrate the smart contract with values from the blockchain
      App.bjTokenGameInst = await App.contracts.BJTokenGame.deployed()
   },

   handleEvents: async () => {
      let balanceEvent = App.bjTokenGameInst.BalanceOf(function (error, result) {
         if (error) {
            console.log(error)
         } else if (result.args._account != App.account) {
            return
         } else {
            App.setBalance(result.args._amount)
         }
      })

      let amountEvent = App.bjTokenGameInst.SetAmount(function (error, result) {
         if (error) {
            console.log(error)
         } else {
            App.setAmount(result.args._user, result.args._newAmount)
         }
      })

      let alertEvent = App.bjTokenGameInst.Alert(function (error, result) {
         if (error) {
            console.log(error)
         } else {
            alert(result.args._msg)
         }
      })

      let htmlTextEvent = App.bjTokenGameInst.ChangeHTMLText(function (error, result) {
         if (error) {
            console.log(error)
         } else {
            App.setText(result.args._id, result.args._newText)
         }
      })

      let placeCardEvent = App.bjTokenGameInst.PlaceCard(function (error, result) {
         if (error) {
            console.log(error)
         } else {
            index = result.args._index
            user = result.args._user
            if (index < 1 || index > 7) {
               console.log("bad");
               return;
            }
            if (result.args._suit == "remove") {
               App.setText(user + index, "")
            } else {
               let u = "p";
               if (user == "Dealer") {
                  u = "d"
               }
               App.setText(u + index, result.args._value + result.args._suit)
            }
         }
      })
   },

   render: async () => {

      // Render Account
      $('#account').html(App.account)

      let search = location.search.substring(1);
      let params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
      if (isNaN(Number(params["Balance"])) || Number(params["Balance"]) < 0) {
         window.location.replace("index.html");
         alert("Deposit amount must be a non-negative integer!");
      }
      App.cleanTable()

      App.setText("DealerMsg", "Dealer Hand:")
      App.setText("PlayerMsg", "Player (" + params["Player"] + ") Hand:")

      App.setBalance(0)
      let desiredBalance = Number(params["Balance"]);

      console.log("desired balance: " + desiredBalance)

      if (desiredBalance == 0) {
         App.bjTokenGameInst.refreshBalance();
      } else {
         App.bjTokenGameInst.buyTokens(Number(params["Balance"]), 
            {value: App.tokenPrice * Number(params["Balance"])}).catch(function () { 
            console.log("token error");
         })
      }
   },

   withdraw: async () => {
      await App.bjTokenGameInst.withdraw(App.balance);
   },

   // --------------------------- html functions ---------------------------------------------------

   getText: async (id) => {
      return $("#" + id).text();
   },

   setText: async (id, newValue) => {
      $("#" + id).text(newValue)
   },

   setBalance: async (newBalance) => {
      App.balance = newBalance;
      App.setText("balance", "Balance: " + newBalance)
   },

   setAmount: async (user, newAmount) => {
      let id = "total" + user;
      App.setText(id, user + " total: " + newAmount);
   },

   // --------------------------- game functions ---------------------------------------------------


   cleanTable: async () => {
      // clean: all the cards
      for (let i = 1; i < 7; i++){
         document.getElementById("p" + i).innerText = "";
      }
      for (let i = 1; i < 7; i++){
         document.getElementById("d" + i).innerText = "";
      }

      document.getElementById("msg").innerText = "Press \'New Game\' to start again!";
   }

   hit: async () => {
      await App.bjTokenGameInst.hitHTML()
   },

   stand: async () => {
      await App.bjTokenGameInst.standHTML()
   },

   newGame: async () => {
      await App.bjTokenGameInst.singleGame()
   }
   






}

$(() => {
   $(window).load(() => {
      App.load()
   })
})