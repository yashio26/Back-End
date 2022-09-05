export default class UserDTO {
    constructor({ username, email, name, address, phone }) {
        this.username = username
        this.email = email
        this.name = name
        this.address = address
        this.phone = phone
    }
}

export function returnUserDto(users) {
    if (Array.isArray(users)) {
        return users.map(user => new UserDTO(user))
    } else {
        return new UserDTO(users)
    }
}