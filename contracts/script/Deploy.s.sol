// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";

import {GucoGame} from "../src/GucoGame.sol";

contract DeployGucoGame is Script {
     uint256 deployerPrivateKey;

    function run() public {

        // address deployer = vm.addr(deployerPrivateKey);

        if (block.chainid == 31337) {
            deployerPrivateKey = vm.envUint("ANVIL_PRIVATE_KEY");
        } else {
            deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        }

        // console2.log("Deploying with address:", deployer);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Log initial balance
        // uint256 initialBalance = deployer.balance;
        // console2.log("Initial balance:", initialBalance);
        
        // Deploy contract and measure gas
        uint256 gasStart = gasleft();
        GucoGame game = new GucoGame();
        
        uint256 gasUsed = gasStart - gasleft();
        
        vm.stopBroadcast();
        
        // Log deployment info
        console2.log("GucoGame deployed at:", address(game));
        console2.log("Gas used:", gasUsed);
        console2.log("Deployment cost:", gasUsed * tx.gasprice);
               
    }
} 