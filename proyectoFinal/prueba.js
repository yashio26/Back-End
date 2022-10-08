import bcrypt from 'bcryptjs'

const a = await bcrypt.hash('1122', 10)
console.log(a)