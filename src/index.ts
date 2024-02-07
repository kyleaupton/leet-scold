import { didSubmitToday } from './leeetcode.js'

// console.log(await didSubmitToday('kyleaupton'))

//
// Main
//
// setInterval(() => {
//   const now = new Date(new Date().toUTCString())

//   if () {

//   }
// }, 1000 * 60) // 1 minute

const checkUsers = async (): Promise<void> => {
  // const users = db.get('usernames').value()
  const users = ['kyleaupton']

  for (const username of users) {
    const submitted = await didSubmitToday(username)
    console.log(`${username} submitted today: ${submitted}`)
  }
}

await checkUsers()
