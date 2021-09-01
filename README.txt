In the contract, the exchange rate from tokens to ETHER is: 1000 tokens = 1 ETHER


Admin:

You need to download Ganache program, and metamask extension.
Download the blackJack directory.
Open a new workspace in Ganache, the first user there will be the "admin".
Connect to metamask with the first user from the Ganache workspace.

Open cmd, direct to the bjEther directory and execute the following commands:
1. "truffle compile" - This will compile the contract
2. "truffle migrate" - This will upload the contract to the Ganache blockchain.
3. "npm run dev" - This will run the server written in index.html.

In the first page, you can deposit ETHER into the contract.

If you want to get all the ETHER from the contract , login as adming and press "Withdraw All".


User (Not the admin):

Execute "npm run dev" 
Fill your name and the amount of tokens you wish to deposit into the game.
You entered the game. 
Write how many tokens you want to bet on, and press "New Game". 
Now, you can play a game of blackjack.

If you want to get your ETHER back, press "Withdraw".


BlackJack Rules:

Object Of The Game:

Each participant attempts to beat the dealer by getting a count as close to 21 as possible, without going over 21.
If there is a tie, nobody wins.

The Play:

The player must decide whether to "stand" (not ask for another card) or "hit" (ask for another card in an attempt to get closer to a count of 21, or even hit 21 exactly). Thus, a player may stand on the two cards originally dealt to them, or they may ask the dealer for additional cards, one at a time, until deciding to stand on the total (if it is 21 or under), or goes "bust" (if it is over 21). In the latter case, the player loses and the dealer collects the bet wagered.

The combination of an ace with a card other than a ten-card is known as a "soft hand," because the player can count the ace as a 1 or 11, and either draw cards or not. For example with a "soft 17" (an ace and a 6), the total is 7 or 17. While a count of 17 is a good hand, the player may wish to draw for a higher total. If the draw creates a bust hand by counting the ace as an 11, the player simply counts the ace as a 1 and continues playing by standing or "hitting" (asking the dealer for additional cards, one at a time).


Dealer's Play:

If the total is 17 or more, it must stand. If the total is 16 or under, they must take a card. The dealer must continue to take cards until the total is 17 or more, at which point the dealer must stand. If the dealer has an ace, and counting it as 11 would bring the total to 17 or more (but not over 21), the dealer must count the ace as 11 and stand. The dealer's decisions, then, are automatic on all plays, whereas the player always has the option of taking one or more cards.

