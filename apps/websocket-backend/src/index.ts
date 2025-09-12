import dotenv from 'dotenv'
dotenv.config()
import { WebSocketServer } from 'ws'
import {dbConnect} from '@repo/mongodb/mongodb'

(async()=>{
  await dbConnect()
})()

const wss = new WebSocketServer({port:8080})

wss.on('connection',(socket)=>{

  socket.send("Hey")
})