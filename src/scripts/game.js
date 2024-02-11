
import * as Colyseus from "colyseus.js"


document.addEventListener("DOMContentLoaded", function(event) {
    (async function() {

        const gameServerUrl = 'http://localhost:3010'

        avatarUrl = './models/8f480707-f52a-4950-8ee2-1afb09f1e48c.glb'
        avatarToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvY2xvdWQtbXRzdmVyc2UubXNjZGV2LnJ1XC9hdXRoXC9tdHNcL2NhbGxiYWNrIiwiaWF0IjoxNjk1MzM0NzQzLCJleHAiOjE2OTc5MjY3NDMsIm5iZiI6MTY5NTMzNDc0MywianRpIjoiTFlQY0c4Vkg1RjF1S0xvbyIsInN1YiI6NzE5LCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3IiwibmFtZSI6bnVsbCwidXVpZCI6IjE1NWRlNTI5LWY1MmQtNGJjZC1iZWZhLTk3NjMwZWExY2I2YyJ9.RYPJUzUlCjqXq8GRBUI1r8HzY5V_RysFpnaQkF9cORQ"; // "TestAccToken";
        avatarKey = "85bf61acf99b0e6fa36c86c62d31273038a8a84b"; //"TestAccKey";
        avatarDrone = false;
        avatarAuthorized = false;

        const gameClient = new Colyseus.Client(gameServerUrl);
        let gameRoom = null;
        let _players = {};
        let _currentPlayer = {
            x: Math.floor(Math.random() * 800),
            y: Math.floor(Math.random() * 800),
            z: 0,
            rot: 0,
            anim: 0,
            robot: false,
            name: '',
            avatar: '',
            drone: false
        };

        function updatePlayer(_currentPlayer, player) {
            _currentPlayer.x = player.x;
            _currentPlayer.y = player.y;
            _currentPlayer.z = player.z;
            _currentPlayer.rot = player.rot;
            _currentPlayer.anim = player.anim;
            _currentPlayer.name = player.name;
            _currentPlayer.robot = player.robot;
        }

        // game client
        try {
            let roomName = "Lobby";

            gameRoom = await gameClient.joinOrCreate(roomName, {
                token: 'TOKEN_AAAA',
                key: 'AVATAR_AAA',
            })

            gameRoom.state.players.onAdd(function(player, sessionId) {
                let isCurrentPlayer = (sessionId === gameRoom.sessionId);
                if (!isCurrentPlayer) {
                    console.log("add player!", player);

                    _players[sessionId] = {
                        obj: null,
                        currentAnim: 0,
                    };

                    updatePlayer(_players[sessionId], player);

                    // listen for individual player changes
                    player.onChange(function(changes) {
                        //console.log(changes);
                        updatePlayer(_players[sessionId], player);
                    })
                }
            })

            _currentPlayer.name = avatarName
            _currentPlayer.avatar = avatarUrl
            _currentPlayer.drone = avatarDrone
            //_currentPlayer.authorized = avatarAuthorized;
            gameRoom.send("updatePlayerInfo", _currentPlayer)


            gameRoom.state.players.onRemove(function(player, sessionId) {
                if (_players[sessionId].obj) _players[sessionId].obj.dispose()
                if (_players[sessionId].droneObj) _players[sessionId].droneObj.dispose()

                delete _players[sessionId]
            })

            gameRoom.onMessage("userInfo", (message) => {
                    console.log("userInfo", message);
            })

            gameRoom.onMessage("authPlayer", (message) => {
                console.log(
                    "authPlayer", 
                    JSON.stringify({
                        token: message.token,
                        key: message.key,
                        room: message.room,
                        version: message.version
                    })
                )
                console.log("game server", message.version)
            })
        } catch (error) {
            console.error("server connection error", error)
        }

        const update = () => {
            // gameClient
            //if (currentTimeSec > SHARED_VARS.playerLastUpdateTime + 0.05 && (SHARED_VARS.playerPositionPrevious.subtract(SHARED_VARS.playerRootNode.position).length() > 0.02 || Math.abs(playerRootOldRotation - SHARED_VARS.playerRootNode.rotation.y) > 0.01 || _currentPlayer.anim != playerCurrentAnimationIndex || currentTimeSec > SHARED_VARS.playerLastUpdateTime + 10)) {
            //    _currentPlayer.x = SHARED_VARS.playerRootNode.position.x;
            //    _currentPlayer.y = SHARED_VARS.playerRootNode.position.y;
            //    _currentPlayer.z = SHARED_VARS.playerRootNode.position.z;
            //    _currentPlayer.rot = SHARED_VARS.playerRootNode.rotation.y;

            //    _currentPlayer.anim = playerCurrentAnimationIndex;

            //    SHARED_VARS.playerLastUpdateTime = currentTimeSec;

            //    // update player
            //    if (gameRoom !== null) {
            //        let {
            //            name,
            //            avatar,
            //            robot,
            //            ...mes
            //        } = _currentPlayer;
            //        gameRoom.send("updatePlayerPos", mes);
            //    }
            //}
        } 

        // destroy scene
        //if (gameRoom !== null) {
        //    gameRoom.leave()
        //    gameRoom = null
        //}




    })()
})
