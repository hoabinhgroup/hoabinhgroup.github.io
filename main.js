var socket = io.connect('https://webrtc66.herokuapp.com/')


$('#div-chat').hide();

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
	//console.log(arrUserInfo);
	 $('#div-chat').show();
    $('#div-dang-ky').hide();

    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    });
	
	socket.on('CO_NGUOI_DUNG_MOI', user => {
	const { ten, peerId } = user;
	$('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
	//console.log(user);
	});
	
	 socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAT', () => alert('Vui long chon username khac!'));

function openStream() {
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

 //openStream()
// .then(stream => playStream('localStream', stream));

const peer = new Peer({key: 'lwjd5qra8257b9'});
//const peer = new Peer({key: 'peerjs', host: 'svwebrtc.herokuapp.com', secure: true, port: 443});

peer.on('open', id => {
	 $('#my-peer').append(id);
	  $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        console.log(socket);
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });
});

//Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});


//Callee
peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

$('#ulUser').on('click', 'li', function() {
    const id = $(this).attr('id');
    console.log(id);
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

