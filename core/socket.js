const { ObjectID } = require('mongodb')
const mongodb = require('./mongodb')


module.exports = (http) => {
    let io = require('socket.io')(http)

    io.on('connection', socket => {

        console.log('user connection', socket.id)

        socket.on('chat message', (obj, callback) => {
            let { msg, room, uid } = obj
            console.log(uid)
            if (ObjectID.isValid(uid)) {
                uid = ObjectID(uid)

                console.log('server message:', msg)
                // socket.broadcast.emit('receive message', { msg })


                let created_at = (new Date()).getTime()
                mongodb('Message').insertOne({ message: msg, user: uid, room: ObjectID(room), created_at }, (err, result) => {
                    if (err) throw (err)
                    else {
                        socket.to(room).emit('receive message', result.ops?.[0])
                        callback(result.ops?.[0])
                    }
                })


                // user, room, message, created_at

            }

        })

        socket.on('load room', (uid, callback) => {
            mongodb('Room').aggregate([
                {
                    $match: {
                        'people': ObjectID(uid)
                    }
                },
                {
                    $lookup: {
                        from: 'user',
                        localField: 'people',
                        foreignField: '_id',
                        as: 'people'
                    }
                }
            ]).toArray((err, result) => {
                if (err) throw err;
                else {
                    callback(result)
                }
            })
        })


        socket.on('load data', (room, callback) => {
            mongodb('Message').find({ room }).toArray((err, result) => {
                if (err) throw (err)
                else {
                    callback(result)
                }
            })
        })

        socket.on('join room', (roomName, outName) => {
            if (outName) {
                socket.leave(outName)
            }
            socket.join(roomName)
        })



        socket.on('disconnect', () => {
            console.log('user disconnection')
        })
    })
}