(function(){

    var socket = io();
    var existingRooms = jQuery('#existing-rooms');

    // socket.on('connect', function () {
    //     console.log('CONNECT on index page');
    // });
    //
    // socket.on('disconnect', function () {
    //     console.log('DISCONNECT on index page');
    // });

    socket.on('updateActiveRoomsList', function (rooms) {
        // console.log('Received event updateActiveRoomsList', rooms);
        existingRooms.empty();

        var roomSelectInput = jQuery('#existing-rooms');

        if (rooms.length > 0) {
            existingRooms.append(jQuery('<option value=""></option>').text("Select a room"));
            rooms.forEach(function (roomName) {
                existingRooms.append(jQuery('<option value="' + roomName + '"></option>').text(roomName));
            });
            roomSelectInput.prop('disabled', false);
        } else {
            existingRooms.append(jQuery('<option value=""></option>').text("No active rooms"));
            roomSelectInput.prop('disabled', true);
        }
    });

    function setActiveRoomInput(inputType) {
        var roomTextInput = jQuery('#room');
        var roomSelectInput = jQuery('#existing-rooms');
        if (inputType === 'text') {
            roomTextInput.closest('.form-field').addClass('active');
            roomSelectInput.closest('.form-field').removeClass('active');
        } else if (inputType === 'select') {
            roomTextInput.closest('.form-field').removeClass('active');
            roomSelectInput.closest('.form-field').addClass('active');
        } else {
            console.log('ERROR: unknown inputType ' + inputType + 'in function setActiveRoomInput');
        }
    }

    var roomSelectInput = jQuery("#existing-rooms");
    roomSelectInput.on('focus', function(event) {
        setActiveRoomInput('select');
    });

    var roomTextInput = jQuery("#room");
    // roomTextInput.on('focus', function(event) {
    //     setActiveRoomInput('text');
    // });
    roomTextInput.on('keyup', function(event) {
        var roomTextInputVal = roomTextInput.val().trim();
        if (roomTextInputVal.length > 0) {
            setActiveRoomInput('text');
            // console.log('room input is ', roomTextInputVal);
        } else {
            setActiveRoomInput('select');
            // console.log('room input is empty');
        }
    });

    var joinForm = jQuery("#join-form");
    joinForm.submit(function(event) {
        event.preventDefault();

        var name = joinForm.find('#name').val().trim();
        var room = joinForm.find('.room-input-field.active > .room-input').val().trim();

        var nameInputField = jQuery('.name-input-field');
        var roomInputFields = jQuery('.room-input-field');

        nameInputField.removeClass('error');
        roomInputFields.removeClass('error');
        if (!name || !room) {
            if (!room) {
                roomInputFields.addClass('error');
                joinForm.find('.room-input-field.active > .room-input');
            }
            if (!name) {
                nameInputField.addClass('error');
                joinForm.find('#name').focus();
            }
        } else {
            var newUrl = joinForm.attr('action') + '?name=' + name + '&room=' + room;
            window.location.href = newUrl;
        }
    });

})();
