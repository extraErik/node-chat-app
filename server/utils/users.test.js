const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Erik',
            room: 'Node Course'
        },{
            id: '2',
            name: 'Meghan',
            room: 'React Course'
        },{
            id: '3',
            name: 'Evan',
            room: 'Node Course'
        }]
    });

    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'Erik',
            room: 'Coffee Organisms'
        }
        var resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        var userId = '1';
        var user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it ('should not remove a user', () => {
        var userId = '99';
        var user = users.removeUser(userId);

        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find user', () => {
        var userId = '1';
        var user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it('should not find user', () => {
        var userId = '99';
        var user = users.getUser(userId);

        expect(user).toNotExist();
    });

    it('should return names for a Node Course room', () => {
        var userList = users.getUserList('Node Course');
        expect(userList).toEqual(['Erik', 'Evan']);
    });

    it('should return names for a Node Course room, with specified name listed first', () => {
        var userList = users.getUserList('Node Course', 'Evan');
        expect(userList).toEqual(['Evan', 'Erik']);
    });

    it('should return names for a React Course room', () => {
        var userList = users.getUserList('React Course');
        expect(userList).toEqual(['Meghan']);
    });

    it('should return list of active rooms', () => {
        var roomsList = users.getActiveRoomsList();
        expect(roomsList.length).toBe(2);
        expect(roomsList).toInclude('Node Course');
        expect(roomsList).toInclude('React Course');
    });
});
