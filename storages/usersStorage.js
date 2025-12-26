class UsersStorage {
    constructor() {
        this.storage = {};
        this.id = 0;
    }

    addUser({ firstName, lastName, email, age = null, bio = null }) {
        const id = this.id;
        this.storage[id] = { 
            id, 
            firstName, 
            lastName,
            email,
            age,
            bio
        };
        this.id++
    }

    getUsers() {
        return Object.values(this.storage);
    }

    getUser(id) {
        return this.storage[id];
    }

    searchUser({ searchedName, searchedEmail }) {
        if (this.storage) {
            let tempArr = Object.values(this.storage);
            let results = tempArr.filter((user) => (`${user.firstName} ${user.lastName}` === searchedName) || (user.email === searchedEmail));
            return results[0];
        } else return null;
    }

    updateUser(id, { firstName, lastName, email, age = null, bio = null }) {
        this.storage[id] = { 
            id, 
            firstName, 
            lastName,
            email, 
            age, 
            bio
        };
    }

    deleteUser(id) {
        delete this.storage[id];
    }
}

module.exports = new UsersStorage();