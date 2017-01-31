(function(){

    var socket = io();
    var existingRooms = jQuery('#existing-rooms');

    socket.on('updateActiveRoomsList', function (rooms) {

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

    function clearRoomSelect(flag) {
        if (flag) {
            jQuery('#existing-rooms').val('');
            jQuery('#existing-rooms').closest('.form-field').addClass('gray-out');
        } else {
            jQuery('#existing-rooms').closest('.form-field').removeClass('gray-out');
        }
    };

    function clearRoomInput(flag) {
        if (flag) {
            jQuery('#room').val('');
            jQuery('#room').closest('.form-field').addClass('gray-out');
        } else {
            jQuery('#room').closest('.form-field').removeClass('gray-out');
        }
    };

    var roomSelectInput = jQuery("#existing-rooms");
    roomSelectInput.on('focus', function(event) {
        clearRoomSelect(false);
    });
    roomSelectInput.on('change', function(event) {
        clearRoomInput(true);
    });

    var roomTextInput = jQuery("#room");
    roomTextInput.on('focus', function(event) {
        clearRoomInput(false);
    });
    roomTextInput.on('keyup', function(event) {
        var roomTextInputVal = roomTextInput.val().trim();
        if (roomTextInputVal.length > 0) {
            clearRoomSelect(true);
            clearRoomInput(false);
        } else {
            clearRoomSelect(false);
        }
    });
    roomTextInput.on('blur', function(event) {
        var roomTextInputVal = roomTextInput.val().trim();
        if (roomTextInputVal.length == 0) {
            clearRoomInput(true);
        }
    });

    var joinForm = jQuery("#join-form");
    joinForm.submit(function(event) {
        event.preventDefault();

        var name = joinForm.find('#name').val().trim();
        var room;

        var selectedRoom = joinForm.find('.room-input-field select').val().trim();
        var newRoom = joinForm.find('.room-input-field input').val().trim();

        room = newRoom ? newRoom : selectedRoom;
        room = _.startCase(room);

        var nameInputField = jQuery('.name-input-field');
        var roomInputFields = jQuery('.room-input-field');

        nameInputField.removeClass('error');
        roomInputFields.removeClass('error');
        if (!name || !room) {
            if (!room) {
                roomInputFields.addClass('error');
                joinForm.find('.room-input-field input').focus();
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
