import {CardCommentController} from './api/card-comment/card-comment.controller';
import {CardController} from './api/card/card.controller';
import {DocsController} from './api/docs/docs.controller';
import {MapController} from './api/map/map.controller';
import {OrganizationController} from './api/organization/organization.controller';
import {RatingController} from './api/rating/rating.controller';
import {UserController} from './api/user/user.controller';

export const AppModules = {
    Controllers: [
        CardController,
        CardCommentController,
        DocsController,
        MapController,
        OrganizationController,
        RatingController,
        UserController,
    ],
};
