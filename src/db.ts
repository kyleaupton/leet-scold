import { JSONFilePreset } from 'lowdb/node'

interface IData { usernames: string[] }
const defaultData = { usernames: [] }

const db = await JSONFilePreset<IData>('db.json', defaultData)

export { db }
