import { Socket } from "net";
import { MessageObj } from "src/Schemas/chat.schema";

export const sendFriendConnectedEvent = (user: Socket, friendId: string) => {
    user.emit("userConnected", JSON.stringify({friendId}));
}

export const sendFriendDisconnedEvent = (user: Socket, friendId: string) => {
    user.emit("userDisconnected", JSON.stringify({friendId}));
}

export const sendMessageEvent = (user: Socket, message: MessageObj) => {
    user.emit("chatMessage", JSON.stringify({...message}));
}