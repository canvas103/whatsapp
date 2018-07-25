import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Chats, Messages} from '../lib/collections';
import {HTTP} from 'meteor/http';
import translate from 'google-translate-api';

Meteor.methods({
    newMessage(message) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged in to send message.');
        }

        check(message, Match.OneOf(
            {
                text: String,
                type: String,
                chatId: String
            },
            {
                picture: String,
                type: String,
                chatId: String
            }
        ));

        message.timestamp = new Date();
        message.userId = this.userId;

        const messageId = Messages.insert(message);
        Chats.update(message.chatId, {$set: {lastMessage: message}});
        const chat = Chats.findOne(message.chatId);
        const chatBot = Meteor.users.findOne({'profile.type': 'chatBot'});


        if (message.text && Meteor.isServer && _.include(chat.userIds, chatBot._id)) {
            console.log('isServer', Meteor.isServer);

            translate(message.text, {to: 'en'})
                .then(res => {
                    console.log(res);
                    // let s = {
                    //     text: 'Hello there',
                    //     from: {
                    //         language: {didYouMean: false, iso: 'zh-CN'},
                    //         text: {autoCorrected: true, value: '[你好]', didYouMean: false}
                    //     },
                    //     raw: ''
                    // };

                    const result = HTTP.call('GET', 'http://ec2-52-207-241-145.compute-1.amazonaws.com:8080/chat', {
                        params: {sentence: res.text}
                    });
                    console.log(result);
                    translate(result.content, {to: res.from.language.iso})
                        .then(res => {
                            let reMessage = {
                                type: message.type,
                                text: 're-' + res.text,
                                chatId: message.chatId,
                                userId: chatBot._id,
                            };
                            remoteMessage(reMessage);
                        });
                })
                .catch(err => {
                    console.error(err);
                });
        }

        return messageId;
    },

    updateName(name) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged in to update his name.');
        }

        check(name, String);

        if (name.length === 0) {
            throw Meteor.Error('name-required', 'Must provide a user name');
        }

        return Meteor.users.update(this.userId, {$set: {'profile.name': name}});
    }
    ,
    newChat(otherId) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged to create a chat.');
        }

        check(otherId, String);
        const otherUser = Meteor.users.findOne(otherId);

        if (!otherUser) {
            throw new Meteor.Error('user-not-exists',
                'Chat\'s user not exists');
        }

        const chat = {
            userIds: [this.userId, otherId],
            createdAt: new Date()
        };

        const chatId = Chats.insert(chat);

        return chatId;
    }
    ,
    removeChat(chatId) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged to remove a chat.');
        }

        check(chatId, String);

        const chat = Chats.findOne(chatId);

        if (!chat || !_.include(chat.userIds, this.userId)) {
            throw new Meteor.Error('chat-not-exists',
                'Chat not exists');
        }

        Messages.remove({chatId: chatId});

        return Chats.remove({_id: chatId});
    }
    ,
    updatePicture(data) {
        if (!this.userId) {
            throw new Meteor.Error('not-logged-in',
                'Must be logged in to update his picture.');
        }

        check(data, String);

        return Meteor.users.update(this.userId, {$set: {'profile.picture': data}});
    }
})
;

function remoteMessage(message) {

    message.timestamp = new Date();
    const messageId = Messages.insert(message);
    Chats.update(message.chatId, {$set: {lastMessage: message}});

    return messageId;

}