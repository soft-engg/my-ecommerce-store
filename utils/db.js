import mongoose from 'mongoose';
// const connection = {};
// this is function to connect ot db
async function connect() {
  // if connected then use previous and return
  // console.log('pervious connection is', connection.isConnected);
  // if (connection.isConnected === 1) {
  //   console.log('already connected');
  //   return;
  // }

  // // checking if connections availavble
  // if (mongoose.connections.length > 0) {
  //   // saving the connection state information to connection variable
  //   connection.isConnected = mongoose.connections[0].readyState;
  //   // if the connection is connected properly then return and use previous
  //   if (connection.isConnected === 1) {
  //     console.log('use previous');
  //     return;
  //   }
  //   // if not connected properly then disconnect
  //   await mongoose.disconnect();
  // }

  // this is fired when the connection is not available
  // here we are connecting to the databaseasda
  // const db =
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('new connection');
  // here we are storing the connection state to connection variable
  // connection.isConnected = db.connections[0].readyState;
}
// this is function to disconnect from db
async function disconnect() {
  // if (connection.isConnected) {
  //   if (process.env.NODE_ENV === 'production') {
  //     await mongoose.disconnect();
  //   } else {
  //     console.log('not disconnected');
  //   }
  // }
  await mongoose.disconnect();
  console.log('disconnected');
}
function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}
const db = { connect, disconnect, convertDocToObj };
export default db;
