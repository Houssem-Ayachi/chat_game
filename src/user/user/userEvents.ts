import { Socket } from "net";
import { MessageObj } from "src/Schemas/chat.schema";
import { FilteredUser } from "src/Schemas/user.schema";

export const sendFriendConnectedEvent = (user: Socket, friend: FilteredUser) => {
    user.emit("userConnected", JSON.stringify({...friend}));
}

export const sendFriendDisconnedEvent = (user: Socket, friend: FilteredUser) => {
    user.emit("userDisconnected", JSON.stringify({...friend}));
}

export const sendMessageEvent = (user: Socket, message: MessageObj) => {
    user.emit("chatMessage", JSON.stringify({...message}));
}