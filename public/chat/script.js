let socket = io()
let uid = window.location.hash.replace('#', '')

// socket.emit('join room', $('.contacts-outter-wrapper.active li.active').attr('data-target'))
socket.emit('load room', uid, (rooms) => {
    console.log(rooms)
    rooms.forEach(e => renderRoom(e))
})

let loadData = (data) => {

    data.forEach((e) => {
        if (e.user === uid) {
            myMessage(e.message)
        } else {
            receiveMessage(e.message)
        }
    })
}


socket.emit('load data', $('.contacts-outter-wrapper.active li.active').attr('data-target'), loadData)


function renderRoom(room) {
    let { type } = room;
    let roomName;
    if (type === 'private') {
        room.people.forEach(e => {
            if (e._id !== uid) {
                roomName = e.name
            }
        })
    } else {
        roomName = room.name
    }

    let data = `<li data-toggle="tab" data-target="${room._id}">
    <img class="img-circle medium-image" alt="" src="https://bootdey.com/img/Content/avatar/avatar1.png">
    <div class="vcentered info-combo">
       <h3 class="no-margin-bottom name">${roomName}</h3>
       <h5></h5>
    </div>
    <div class="contacts-add"><span class="message-time">3:56 <sup>AM</sup></span><i class="fa fa-trash-o"></i><i class="fa fa-paperclip"></i></div>
 </li>`

    $('.contacts-outter-wrapper.active .contacts').append(data);
}

function receiveMessage(msg) {
    let data = `<div class="message info">
    <img class="img-circle medium-image" alt="" src="https://bootdey.com/img/Content/avatar/avatar1.png">
    <div class="message-body">
       <div class="message-info">
          <h4> Elon Musk </h4>
          <h5><i class="fa fa-clock-o"></i> 2:32 PM</h5>
       </div>
       <hr>
       <div class="message-text">${msg}</div>
    </div>
    <br>
 </div>`

    $('.message-body.active .chat-body').append(data)
}

function myMessage(msg) {
    let data = `<div class="message my-message">
    <img class="img-circle medium-image" alt="" src="https://bootdey.com/img/Content/avatar/avatar1.png">
    <div class="message-body">
       <div class="message-body-inner">
          <div class="message-info">
             <h4> Dennis Novac </h4>
             <h5><i class="fa fa-clock-o"></i> 2:28 PM</h5>
          </div>
          <hr>
          <div class="message-text">${msg}</div>
       </div>
    </div>
    <br>
 </div>`

    $('.message-body.active .chat-body').append(data)
}

$('.send-message-text').keyup(function (e) {
    if (e.which === 13) {
        let val = $(this).val().trim()
        if (val) {
            let room = $('.contacts-outter-wrapper.active li.active').attr('data-target');


            socket.emit('chat message', { msg: val, room, uid }, () => {
                myMessage(val)
                $(this).val('')
            })
            // myMessage(val)

        }
    }
})


$('.contacts-outter-wrapper.active li').on('click', function () {
    let joinName = $(this).attr('data-target')
    let outName = $('.contacts-outter-wrapper.active li.active').attr('data-target')

    if (joinName !== outName) {
        socket.emit('join room', joinName, outName)
        socket.emit('load data', joinName, loadData)
    }
})




socket.on('receive message', (obj) => {
    console.log(obj)
    let { message } = obj
    receiveMessage(message)
})