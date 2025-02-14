// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {GucoGame} from "../src/GucoGame.sol";

contract InteractGucoGame is Script {
    function run() external {
        // Replace with your deployed contract address
        GucoGame game = GucoGame(0x5FbDB2315678afecb367f032d93F642f64180aa3);
        
        vm.startBroadcast();
        
        // Create a sample level
        bytes32 levelData = bytes32(abi.encodePacked(
            uint8(1), uint8(2), uint8(3), uint8(4), uint8(5)
        ));
        game.createLevel(levelData);
        
        vm.stopBroadcast();
    }
} 