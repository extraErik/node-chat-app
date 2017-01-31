(function(){

    var socket = io();

    var joinForm = jQuery("#join-form");
    var nameInputField = jQuery('.name-input-field');
    var nameTextInput = jQuery('#name');
    var roomInputFields = jQuery('.room-input-field');
    var existingRooms = jQuery('#existing-rooms');
    var roomTextInput = jQuery("#room");

    socket.on('updateActiveRoomsList', function (rooms) {

        existingRooms.empty();

        if (rooms.length > 0) {
            existingRooms.append(jQuery('<option value=""></option>').text("Select a room"));
            rooms.forEach(function (roomName) {
                existingRooms.append(jQuery('<option value="' + roomName + '"></option>').text(roomName));
            });
            existingRooms.prop('disabled', false);
        } else {
            existingRooms.append(jQuery('<option value=""></option>').text("No active rooms"));
            existingRooms.prop('disabled', true);
        }
    });

    function clearRoomSelect(flag) {
        if (flag) {
            existingRooms.val('');
            existingRooms.closest('.form-field').addClass('gray-out');
        } else {
            existingRooms.closest('.form-field').removeClass('gray-out');
        }
    };

    function clearRoomInput(flag) {
        if (flag) {
            roomTextInput.val('');
            roomTextInput.closest('.form-field').addClass('gray-out');
        } else {
            roomTextInput.closest('.form-field').removeClass('gray-out');
        }
    };

    nameTextInput.on('keyup', function(event) {
        nameInputField.removeClass('error');
    });

    existingRooms.on('focus', function(event) {
        clearRoomSelect(false);
    });
    existingRooms.on('change', function(event) {
        roomInputFields.removeClass('error');
        clearRoomInput(true);
    });

    roomTextInput.on('focus', function(event) {
        clearRoomInput(false);
    });
    roomTextInput.on('keyup', function(event) {
        roomInputFields.removeClass('error');
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

    joinForm.submit(function(event) {
        event.preventDefault();

        var name = nameTextInput.val().trim();
        var room;

        var selectedRoom = joinForm.find('.room-input-field select').val().trim();
        var newRoom = joinForm.find('.room-input-field input').val().trim();

        room = newRoom ? newRoom : selectedRoom;
        room = _.startCase(room);

        nameInputField.removeClass('error');
        roomInputFields.removeClass('error');
        if (!name || !room) {
            if (!room) {
                roomInputFields.addClass('error');
                roomTextInput.focus();
            }
            if (!name) {
                nameInputField.addClass('error');
                nameTextInput.focus();
            }
        } else {
            var newUrl = joinForm.attr('action') + '?name=' + name + '&room=' + room;
            window.location.href = newUrl;
        }
    });

})();
