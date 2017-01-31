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
    getUserList (room, thisUserName) {
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map((user) => user.name);
        namesArray.sort();

        if (thisUserName) {
            _.pull(namesArray, thisUserName);
            namesArray.unshift(thisUserName);
        }

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

// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

// class Person {
//     constructor (name, age) {
//         this.name = name;
//         this.age = age;
//     }
//     getUserDescription () {
//         return `${this.name} is ${this.age} years old.`;
//     }
// }
//
// var me = new Person('Erik', 137);
// var description = me.getUserDescription();
// console.log(description);
