export default class UserDTO {
    constructor({ id, username, email, name, address, phone }) {
        this.id = id
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