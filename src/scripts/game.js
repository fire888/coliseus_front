import * as Colyseus from "colyseus.js"

const id = Math.floor(Math.random() * 100000)
const isMove = true/ Math.random() < .5

const roomName = "Lobby";
const gameServerUrl = 'http://localhost:3010'
const avatarKey = "85bf61acf99b0e6fa36c86c62d31273038a8a84b"; //"TestAccKey"
const avatarName = 'AVATAR_NAME_' + id
console.log('currentName', avatarName)

const init = async () => {
    const bCreate = document.getElementById('createRoom')
    bCreate.onclick = async () => {
        const gameClient = new Colyseus.Client(gameServerUrl)
        const gameRoom = await gameClient.create(roomName, {
            token: "TestAccToken",
            key: avatarKey,
            type: 'private',
            pass: 'AAA',
        })

        gameRoom.state.players.onAdd((player, sessionId) => {
            if (sessionId === gameRoom.sessionId) {
                console.log('add THIS PLAYER !!!!!!!!', sessionId, player)
                return;
            }
            console.log('add newPlayer!!!!!!!!', sessionId, player)
        })

        gameRoom.state.players.onRemove(function(player, sessionId) {
            console.log('deletePlayer', sessionId)
            //delete _players[sessionId]
        })

        console.log('gameRoom', gameRoom)
        console.log('roomID', gameRoom.roomId)
    }


    const bAuto = document.getElementById('butJoinAuto')
    bAuto.onclick = async () => {

        const _players = {}
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
            type: 'public',
        })

        console.log(gameRoom)



        const updatePlayer = (_currentPlayer, player) => {
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
                console.log('add THIS PLAYER !!!!!!!!', sessionId, player)
                return;
            }

            console.log('add newPlayer!!!!!!!!', sessionId, player)
            _players[sessionId] = {}
            player.onChange((changes) => {
                updatePlayer(_players[sessionId], player)
            })
        })

        gameRoom.state.players.onRemove(function(player, sessionId) {
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
            console.log("on Auth Player", message)
            console.log('__ROOM_ID:', message.room)
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

        gameRoom.send("updatePlayerInfo", _currentPlayer)
    }


    let roomId = null
    const inputRoomId = document.getElementById('inputRoomId')
    inputRoomId.addEventListener('change', v => {
        roomId = v.target.value
        console.log('INPIT_value_room', roomId)
    })

    let pass = null
    const inputPass = document.getElementById('inputPass')
    inputPass.addEventListener('change', v => {
        pass = v.target.value
        console.log('INPIT_value_pass', pass)
    })



    const butIdJoin = document.getElementById('butJoinByIdRoom')
    butIdJoin.onclick = async () => {
        const _players = {}
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

        const gameRoom = await gameClient.joinById(roomId, {
            token: "TestAccToken",
            key: avatarKey,
            type: 'private',
            pass,
        })

        console.log('gameRoom', gameRoom)

        const updatePlayer = (_currentPlayer, player) => {
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
                console.log('add THIS PLAYER !!!!!!!!', sessionId, player)
                return;
            }

            console.log('add newPlayer!!!!!!!!', sessionId, player)

            _players[sessionId] = {}
            player.onChange((changes) => {
                updatePlayer(_players[sessionId], player)
            })
        })

        gameRoom.state.players.onRemove(function(player, sessionId) {
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
            console.log("on Auth Player", message)
            console.log('__ROOM_ID:', message.room)
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

        gameRoom.send("updatePlayerInfo", _currentPlayer)
    }

}


document.addEventListener("DOMContentLoaded", () => {
    init().then()
})
