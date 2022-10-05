export default class UserLoginDTO{
    constructor({ username, password }) {
        this.username = username
        this.password = password
    }
}

export function returnUserLoginDto(users) {
    if (Array.isArray(users)) {
        return users.map(user => new UserLoginDTO(user))
    } else {
        return new UserLoginDTO(users)
    }
}