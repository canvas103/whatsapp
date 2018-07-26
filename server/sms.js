import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
console.log('sms',SMS);

// if (Meteor.settings && Meteor.settings.ACCOUNTS_PHONE) {
//     Accounts._options.adminPhoneNumbers = Meteor.settings.ACCOUNTS_PHONE.ADMIN_NUMBERS;
//
//     Accounts._options.phoneVerificationMasterCode = Meteor.settings.ACCOUNTS_PHONE.MASTER_CODE;
// }
SMS.twilio = {FROM: '+16312121062', ACCOUNT_SID: 'AC2113c40fcc3bf577b42fc3d12a5323f3', AUTH_TOKEN: '5376efa7519ab6963cad95ec126c1c31'};
