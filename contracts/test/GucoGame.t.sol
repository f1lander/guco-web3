// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {GucoGame} from "../src/GucoGame.sol";
import {IGucoGame} from "../src/interfaces/IGucoGame.sol";

contract GucoGameTest is Test {
    GucoGame public game;
    address public player1;
    address public player2;

    function setUp() public {
        game = new GucoGame();
        player1 = makeAddr("player1");
        player2 = makeAddr("player2");
        
        // Give some ETH to test accounts
        vm.deal(player1, 10 ether);
        vm.deal(player2, 10 ether);
    }

    function testCreateLevel() public {
        vm.startPrank(player1);
        
        // Create sample level data
        uint8[] memory levelData = new uint8[](5);
        levelData[0] = 1; // Start position
        levelData[1] = 2; // Goal position
        levelData[2] = 3; // Collectible item
        levelData[3] = 4; // Wall
        levelData[4] = 5; // Light switch
        
        uint256 levelId = game.createLevel(levelData);
        
        IGucoGame.Level memory level = game.getLevel(levelId);
        assertEq(level.creator, player1);
        assertEq(level.levelData.length, levelData.length);
        assertEq(level.levelData[0], levelData[0]);
        assertEq(level.playCount, 0);
        assertEq(level.completions, 0);
        assertEq(level.verified, false);

        // Verify level was counted for player
        assertEq(game.getPlayerLevels(player1), 1);
        
        vm.stopPrank();
    }

    function testUpdatePlayerProgress() public {
        vm.startPrank(player1);
        
        // Create a level first
        uint8[] memory levelData = new uint8[](3);
        levelData[0] = 1;
        uint256 levelId = game.createLevel(levelData);
        
        // Create completed level data
        IGucoGame.Level memory completedLevel = IGucoGame.Level({
            levelData: levelData,
            creator: player1,
            playCount: 1,
            completions: 1,
            verified: false
        });
        
        game.updatePlayer(player1, completedLevel);
        
        // Verify player progress
        IGucoGame.Player memory player = game.getPlayer(player1);
        assertEq(player.levelsCompleted, 1);
        assertEq(player.completedLevels.length, 1);
        
        vm.stopPrank();
    }

    function testMultipleLevelCreation() public {
        vm.startPrank(player1);
        
        uint8[] memory levelData = new uint8[](2);
        levelData[0] = 1;
        
        // Create multiple levels
        game.createLevel(levelData);
        game.createLevel(levelData);
        game.createLevel(levelData);
        
        uint256 levelCount = game.getPlayerLevels(player1);
        assertEq(levelCount, 3);
        
        vm.stopPrank();
    }

    function testLevelCompletion() public {
        vm.startPrank(player1);
        
        // Create a level
        uint8[] memory levelData = new uint8[](3);
        levelData[0] = 1;
        uint256 levelId = game.createLevel(levelData);
        
        // Initially level should not be completed
        assertEq(game.isLevelCompleted(player1, levelId), false);
        
        // Mark level as completed (this would normally happen through gameplay)
        IGucoGame.Level memory completedLevel = IGucoGame.Level({
            levelData: levelData,
            creator: player1,
            playCount: 1,
            completions: 1,
            verified: false
        });
        
        game.updatePlayer(player1, completedLevel);
        
        // Now the level should be marked as completed
        assertTrue(game.isLevelCompleted(player1, levelId));
        
        vm.stopPrank();
    }

    function testLevelDataRetrieval() public {
        vm.startPrank(player1);
        
        uint8[] memory originalLevelData = new uint8[](4);
        originalLevelData[0] = 1;
        originalLevelData[1] = 2;
        originalLevelData[2] = 3;
        originalLevelData[3] = 4;
        
        uint256 levelId = game.createLevel(originalLevelData);
        
        uint8[] memory retrievedLevelData = game.getLevelData(levelId);
        
        assertEq(retrievedLevelData.length, originalLevelData.length);
        for(uint i = 0; i < retrievedLevelData.length; i++) {
            assertEq(retrievedLevelData[i], originalLevelData[i]);
        }
        
        vm.stopPrank();
    }
}