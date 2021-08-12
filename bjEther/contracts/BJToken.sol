pragma solidity ^0.5.0;

contract BJToken {

    string public constant name = "bjToken";
    string public constant symbol = "BJ";
    // string public constant decimal = 0;
    // uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );


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

    // function approve(address _spender, uint256 _value) public returns (bool success) {
    //     allowance[msg.sender][_spender] = _value;

    //     emit Approval(msg.sender, _spender, _value);

    //     return true;
    // }

    // function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    //     require(_value <= balanceOf[_from]);
    //     require(_value <= allowance[_from][msg.sender]);

    //     balanceOf[_from] -= _value;
    //     balanceOf[_to] += _value;

    //     allowance[_from][msg.sender] -= _value;

    //     emit Transfer(_from, _to, _value);

    //     return true;
    // }
}