import {Request, Response} from 'express';
import {readFileSync} from 'fs';
import {join} from 'path';
import {Authorized, Get, JsonController, Req, Res} from 'routing-controllers';
// @ts-ignore
import * as swaggerUi from 'swagger-ui-express';
import {appDir} from '../../util/fs/fs';

const swaggerDocument = JSON.parse(readFileSync(join(appDir, 'docs', 'swagger.json'), 'utf8'));

@JsonController('/docs')
@Authorized('admin')
export class DocsController {
    /**
     * @description Provide swagger docs
     */
    @Get()
    get(@Req() req: Request, @Res() res: Response): void {
        swaggerUi.setup(swaggerDocument)(req, res);
    }
}
