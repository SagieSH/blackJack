pragma solidity ^0.5.0;

contract BJToken {

    string public constant name = "bjToken";
    string public constant symbol = "BJ";


    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    

    function addTokens(address _to, uint256 _amount) public returns (bool success) {
        balanceOf[_to] += _amount;
        return true;
    }

    function deductTokens(address _to, uint256 _amount) public returns (bool success) {
        require(balanceOf[_to] >= _amount);
        balanceOf[_to] -= _amount;
        return true;
    }
}