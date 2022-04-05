# Teaching Library - Image Processing Laboratory
### Table of Content

- [Pre-requirements](#pre-requirements)
- [Install](#install)
- [Configure](#configure)
- [Start](#start)
- [Development](#for-developers)
- [Documentation]()

### Pre-requirements
- Install [GIT](https://git-scm.com/)
- Install [NodeJS](https://nodejs.org/)
- Install one of SQL Database Server from following:
    - MSSQL
    - MySQL / MariaDB
    - SQLite
    - Oracle
    - PostgreSQL 
- Internet access?

### Install

#### Download
- [download the latest release](https://github.com/95gabor/keplabor-backend/releases)

#### Install locally 
- extract release file
```
> cd <path/to/release>
> npm i --production
```

#### Install globally 
- root access may needed
```
> cd <to release.tgz>
# npm i --production -g ./release.tgz
```

### Configure
- copy _.env.example_ as _.env_
- edit _.env_
 
### Start
```
> npm start
```

## For developers

```
> git clone <REPO_URL>
> cd keplabor-backend
> npm install
```

### To build
```
> npm run build
```

### Documentation

#### REST API

open in browser:

- start server
- login in as admin
- navigate to host/api/docs

or via swagger:

- import dist/docs/swagger.json

#### TypeScript documentation

open _dist/docs/typedocs/index.html_ in your browser
 