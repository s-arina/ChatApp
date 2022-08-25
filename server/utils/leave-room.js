// a function that takes an user id and an array
// and filters out the user based on the id from within the array if it exists

function leaveRoom(userID, chatRoomUsers) {
  return chatRoomUsers.filter((user) => user.id !== userID);
}

module.exports = leaveRoom;
