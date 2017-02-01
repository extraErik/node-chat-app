var _ = require('lodash');

class Users {
    constructor () {
        this.users = [];
    }
    addUser (id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }
    removeUser (id) {
        var user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }
    getUser (id) {
        return this.users.filter((user) => user.id === id)[0];
    }
    getUserList (room) {
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map((user) => user.name);
        namesArray.sort();

        return namesArray;
    }
    getActiveRoomsList() {
        var roomsList = [];
        this.users.forEach((user) => {
            roomsList.push(user.room);
        });
        roomsList = _.sortedUniq(roomsList.sort());
        return roomsList;
    }
}

module.exports = {Users};
