module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            all: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: 'public/**',
                        dest: 'dist/'
                    },
                    {
                        expand: true,
                        cwd: 'src/service/email/',
                        src: '**/*.html',
                        dest: 'dist/service/email/'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/material-design-icons/iconfont/',
                        src: '*',
                        dest: 'dist/public/fonts/material-design-icons/'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/swagger-ui-express/static/',
                        src: '*',
                        dest: 'dist/public/api/docs/'
                    }
                ]
            },
            frontend: {
                files: [
                    {
                        expand: true,
                        cwd: '../frontend/dist/',
                        src: '**',
                        dest: 'src/public/'
                    }
                ]
            }
        },
        watch: {
            dev: {
                files: 'src/**.ts',
                tasks: [
                    //'run:tslint',
                    'run:tsc',
                    'run:server'
                ],
                options: {
                    atBegin: true,
                    interrupt: true,
                    spawn: false
                }
            },
            ide: {
                files: [
                    'dist/app.js',
                    'dist/api/**/*.js'
                ],
                tasks: ['run:server'],
                options: {
                    atBegin: true,
                    interrupt: true,
                    spawn: false
                }
            },
            public: {
                files: '**',
                tasks: ['copy'],
                options: {
                    cwd: 'src/public',
                    atBegin: true,
                    interrupt: true,
                    spawn: false
                }
            }
        },
        run: {
            tslint: {exec: 'npm run tslint'},
            tsc: {exec: 'npm run compile'},
            tsoa: {exec: 'npm run tsoa'},
            typedocs: {exec: 'npm run typedoc'},
            server: {
                options: {
                    wait: false
                },
                exec: 'DEBUG=keplabor* node -r dotenv/config ./dist/app.js'
            }
        },
        concurrent: {
            serve: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: [
                    'watch:dev',
                    'watch:public'
                ]
            },
            ide: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: [
                    'watch:ide',
                    'watch:public'
                ]
            }
        }
    });

    grunt.registerTask('serve', 'concurrent:serve');
    grunt.registerTask('ide', 'concurrent:ide');
    grunt.registerTask('copy', 'copy:all');
    grunt.registerTask('build', [
        'run:tslint',
        'run:tsc',
        'copy',
        'run:tsoa',
        'run:typedocs'
    ]);

    grunt.event.on('watch', function(action, filepath, target) {
        if(target === 'ide' || target === 'dev') {
            grunt.task.run('stop:server')
        } else if (target === 'public') {
            grunt.config(
                'copy.all.files.0.src',
                filepath
                    .slice(
                        grunt.config.get('copy.all.files.0.cwd').length,
                        filepath.length));
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-concurrent');
};
