import { User, UserSchema } from "src/Schemas/user.schema";
import { Trade, TradeSchema } from "src/Schemas/trade.schema";
import { Store, StoreSchema } from "src/Schemas/store.schema";
import { Sticker, StickerSchema } from "src/Schemas/sticker.schema";
import { Message, MessageSchema } from "src/Schemas/message.schema";
import { Level, LevelSchema } from "src/Schemas/level.schema";
import { Chat, ChatSchema } from "src/Schemas/chat.schema";

export default [
    {name: User.name, schema: UserSchema},
    {name: Trade.name, schema: TradeSchema},
    {name: Store.name, schema: StoreSchema},
    {name: Sticker.name, schema: StickerSchema},
    {name: Message.name, schema: MessageSchema},
    {name: Level.name, schema: LevelSchema},
    {name: Chat.name, schema: ChatSchema},
]