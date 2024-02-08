import { JSONFilePreset } from 'lowdb/node'

export interface IUser { leetcodeId: string, discordId: string }
export interface IData { users: IUser[] }

const defaultData: IData = { users: [] }
const db = await JSONFilePreset<IData>('db.json', defaultData)

console.log(db)

export { db }
