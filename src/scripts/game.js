import * as Colyseus from "colyseus.js"
const id = Math.floor(Math.random() * 100000)
const isMove = Math.random() < .5


document.addEventListener("DOMContentLoaded", function(event) {
    (async function() {

        const roomName = "Lobby";
        const gameServerUrl = 'http://localhost:3010'
        const avatarUrl = './models/8f480707-f52a-4950-8ee2-1afb09f1e48c.glb'
        const avatarToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvY2xvdWQtbXRzdmVyc2UubXNjZGV2LnJ1XC9hdXRoXC9tdHNcL2NhbGxiYWNrIiwiaWF0IjoxNjk1MzM0NzQzLCJleHAiOjE2OTc5MjY3NDMsIm5iZiI6MTY5NTMzNDc0MywianRpIjoiTFlQY0c4Vkg1RjF1S0xvbyIsInN1YiI6NzE5LCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3IiwibmFtZSI6bnVsbCwidXVpZCI6IjE1NWRlNTI5LWY1MmQtNGJjZC1iZWZhLTk3NjMwZWExY2I2YyJ9.RYPJUzUlCjqXq8GRBUI1r8HzY5V_RysFpnaQkF9cORQ" // "TestAccToken";
        const avatarKey = "85bf61acf99b0e6fa36c86c62d31273038a8a84b"; //"TestAccKey"
        const avatarDrone = false
        const avatarAuthorized = false
        const avatarName = 'AVATAR_NAME_' + id
        console.log('currentName', avatarName)

        const _players = {};
        const _currentPlayer = {
            x: Math.floor(Math.random() * 800),
            y: Math.floor(Math.random() * 800),
            z: 0,
            rot: 0,
            anim: 0,
            robot: false,
            name: avatarName,
            avatar: '',
            drone: false
        };

        const gameClient = new Colyseus.Client(gameServerUrl)

        const gameRoom = await gameClient.joinOrCreate(roomName, {
            token: "TestAccToken",
            key: avatarKey,
        })



        const updatePlayer = (_currentPlayer, player) => {
            console.log(player.x)
            _currentPlayer.x = player.x;
            _currentPlayer.y = player.y;
            _currentPlayer.z = player.z;
            _currentPlayer.rot = player.rot;
            _currentPlayer.anim = player.anim;
            _currentPlayer.name = player.name;
            _currentPlayer.robot = player.robot;
        }
        // game client

        gameRoom.state.players.onAdd((player, sessionId) => {
            if (sessionId === gameRoom.sessionId) {
                console.log('THIS PLAYER !!!!!!!!', sessionId, player)
                return;
            }

            console.log('newPlayer!!!!!!!!', sessionId, player)

             _players[sessionId] = {
                 obj: null,
                 currentAnim: 0,
            }
            player.onChange((changes) => {
                console.log('sessionId', sessionId, player.x)
                //updatePlayer(_players[sessionId], player)
            })
        })

        _currentPlayer.name = avatarName
        _currentPlayer.avatar = avatarUrl
        _currentPlayer.drone = avatarDrone
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
            console.log("authPlayer", JSON.stringify({
                token: message.token,
                key: message.key,
                room: message.room,
                version: message.version
            }))
            console.log("game server", message.version)
        })

        const update = () => {
            if (gameRoom === null) {
                return
            }
            _currentPlayer.x += isMove ? .1 : 0
            gameRoom.send("updatePlayerPos", {
                x: _currentPlayer.x,
                y: _currentPlayer.y,
                z: _currentPlayer.z,
                rot: _currentPlayer.rot,
                anim: 0,
                name: avatarName,
                avatar: "AAA",
                drone: false,
            })
            requestAnimationFrame(update)
        }
        update()

        // destroy scene
        //if (gameRoom !== null) {
        //    gameRoom.leave()
        //    gameRoom = null
        //}
    })()
})
