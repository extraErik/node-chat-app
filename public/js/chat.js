var socket = io();

var myName, lastMessageFrom;

function scrollToBottom () {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
};

socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search);
    myName = params.name;
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            jQuery('#room-name').attr('title', params.room).html(params.room);
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {

    var myNameIndex = users.indexOf(myName);
    console.log('myNameIndex=' + myNameIndex);
    users.splice(myNameIndex, 1);
    users.unshift(myName);

    var ul = jQuery('<ul></ul>');
    users.forEach(function (user) {
        var li = jQuery('<li></li>');
        li.attr('data-name', user);
        li.append('<span>' + user + '</span>');
        li.append('<img src="/svg/comment.svg" />');
        ul.append(li);
    });
    jQuery('#users').html(ul);
});

socket.on('newMessage', function (message) {

    var html, template, formattedTime;

    if (message.from !== lastMessageFrom) {
        formattedTime = moment(message.createdAt).format('h:mm a');
        template = jQuery('#message-template-with-user').html();
        html = Mustache.render(template, {
            from: message.from,
            text: message.text,
            createdAt: formattedTime
        });
    } else {
        template = jQuery('#message-template-without-user').html();
        html = Mustache.render(template, {
            text: message.text,
        });
    }

    jQuery('#messages').append(html);
    scrollToBottom();

    highlightUser(message.from);

    lastMessageFrom = message.from;
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('typingNotifyAll', function (message) {
    setTypingIndicator(message.name, message.show);
});

function highlightUser(name) {
    var userToHighlight = jQuery('#users li[data-name="' + name +'"]');
     userToHighlight.effect("highlight", {}, 2000);
};

function setTypingIndicator(name, onFlag) {
    var userTypingImg = jQuery('#users li[data-name="' + name +'"] img');
    if (onFlag) {
        userTypingImg.css('visibility', 'visible');
    } else {
        userTypingImg.css('visibility', 'hidden');
    }
};

var messageInput = jQuery('#message-input');
var messagePresent, messagePresentLast, messagePresenceChanged;
messageInput.on('keyup change', function(e) {
    var messageInputVal = messageInput.val();
    messagePresent = messageInputVal ? true : false;
    messagePresenceChanged = messagePresentLast !== messagePresent ? true : false;

    if (messagePresent && messagePresenceChanged) {
        socket.emit('typingNotifyServer', {
            name: myName,
            show: true
        });
    } else if (messagePresenceChanged) {
        socket.emit('typingNotifyServer', {
            name: myName,
            show: false
        });
    }

    messagePresentLast = messagePresent;
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('typingNotifyServer', {
        name: myName,
        show: false
    });

    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('');
    });

});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.prop('disabled', true).text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        locationButton.prop('disabled', false).text('Send location');
    }, function () {
        alert('Unable to fetch location');
        locationButton.prop('disabled', false).text('Send location');
    });
});
