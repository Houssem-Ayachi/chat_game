import { Socket } from "net";
import { Message } from "src/Schemas/chat.schema";
import { FilteredUser } from "src/Schemas/user.schema";

export const sendFriendConnectedEvent = (user: Socket, friend: FilteredUser) => {
    user.emit("userConnected", JSON.stringify({...friend}));
}

export const sendFriendDisconnedEvent = (user: Socket, friend: FilteredUser) => {
    user.emit("userDisconnected", JSON.stringify({...friend}));
}

export const sendMessageEvent = (user: Socket, message: Message) => {
    user.emit("chatMessage", JSON.stringify({...message}));
}

export const sendLeveledUpEvent = (user: Socket) => {
    user.emit("leveledUp");
}