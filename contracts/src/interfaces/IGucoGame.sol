// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IGucoGame {

    struct LevelWithId {
        uint256 id;
        Level level;
    }

    struct Level {
        bytes32 levelData;  // Changed from uint8[]
        address creator;
        uint256 playCount;
        uint256 completions;
        bool verified;
        uint256 createdAt;
    }

    struct Achievement {
        string name;
        string description;
        uint256 points;
        bool unlocked;
    }

    struct Player {
        uint256 levelsCompleted;
        Level[] completedLevels;
    }

    event LevelCreated(uint256 indexed levelId, address indexed creator);
    event LevelCompleted(
        uint256 indexed levelId,
        address indexed userAddress
    );
}
