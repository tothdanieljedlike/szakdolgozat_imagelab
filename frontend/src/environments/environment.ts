// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  whitelistedDomains: ['localhost:8080', 'localhost:4200', '192.168.1.50:8080', '192.168.100.7:8080'],
  reCaptcha: '6Lfq4NIZAAAAAFJ94ZYCVbDF0Cuz_ViMZQhE7x3E'
};
