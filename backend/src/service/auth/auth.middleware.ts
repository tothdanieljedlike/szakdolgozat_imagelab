import {Action} from 'routing-controllers';
import {debug} from '../../util/debug';
import auth from './auth.service';

export async function authorizationChecker(action: Action, roles: string[]): Promise<boolean> {
    try {
        const user = await auth.authenticate(action.request, action.response, action.next);
        if (!roles.length) {
            return true;
        } else {
            return roles.indexOf(user.role) > -1;
        }
    } catch (err) {
        debug('ERROR 1');
        debug(err);
        return false;
    }
}

export function currentUserChecker(action: Action) {
    try {
        return auth.authenticate(action.request, action.response, action.next);
    } catch (err) {
        debug('ERROR 2');
        debug(err);
        throw err;
    }
}
