// const BJToken = artifacts.require("BJToken");

// module.exports = function(deployer) {
//   deployer.deploy(BJToken);
// };


var BJToken = artifacts.require("./BJToken.sol");
var BJTokenGame = artifacts.require("./BJTokenGame.sol");

module.exports = function(deployer) {
  deployer.deploy(BJToken).then(function() {
    // Token price is 1 wei
    var tokenPrice = 1;
    return deployer.deploy(BJTokenGame, BJToken.address, tokenPrice);
  });
};