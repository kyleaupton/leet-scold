import path from 'path'
import { JSONFilePreset } from 'lowdb/node'
import { projectPath } from './utils.js'

export interface IUser { leetcodeId: string, discordId: string }
export interface IData { users: IUser[] }

const defaultData: IData = { users: [] }
const db = await JSONFilePreset<IData>(path.join(projectPath(), 'data', 'db.json'), defaultData)

export { db }
