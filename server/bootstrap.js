import {Meteor} from "meteor/meteor";
import {Accounts} from 'meteor/accounts-base';

Meteor.startup(() => {
    if (Meteor.users.find().count() !== 0) return;

    Accounts.createUserWithPhone({
        phone: '+972501234567',
        profile: {
            name: 'ChatBot',
            type: 'chatBot',
            picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg'
        },
    });

    Accounts.createUserWithPhone({
        phone: '+972501234568',
        profile: {
            name: 'Ethan Gonzalez',
            picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
        }
    });

    Accounts.createUserWithPhone({
        phone: '+972501234569',
        profile: {
            name: 'Avery Stewart',
            picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
        }
    });

});
