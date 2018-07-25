import Moment from 'moment';
import {Filter} from 'angular-ecmascript/module-helpers';

export default class CanlendarFilter extends Filter {
    filter(time) {
        if (!time) return;
        return Moment(time).calendar(null, {
            lastDay: '[Yesterday]',
            sameDay: 'LT',
            lastWeek: 'dddd',
            sameElse: 'DD/MM/YY'
        })
    }
}

CanlendarFilter.$name = 'calendar';