module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

        jshint: {
          files: {
            src: ['Gruntfile.js','src/js/app.js', 'src/js/resumeMap.js', 'src/js/viewHelper.js']
          }
        },
        concat: {
            dist: {
                src: [
                     'src/js/resumeMap.js', 'src/js/viewHelper.js','src/js/app.js'
                ],
                dest: 'src/tmp/resumeApp.js',
            }
          },
        uglify: {
      			build: {
      				src: 'src/tmp/resumeApp.js',
      				dest: 'src/tmp/resumeApp.min.js'
      			}
	     	},

        css_url_replace: {
          options: {
            staticRoot: 'src/img'
          },
          replace: {
            files: {
              'src/tmp/style.urlr.css': ['src/css/style.css']
            }
          }
        }, 

        cssUrlRewrite: {
          dist: {
            src: "src/css/style.css",
            dest: "src/tmp/style.urlrw.css",
            options: {
              skipExternal: true,
              rewriteUrl: function(url, options, dataURI) {
                var path = url.replace(options.baseDir, '');
                path = url.replace("src/", '');

                var hash = require('crypto').createHash('md5').update(dataURI).digest('hex');
                return '' + path;
              }
            }
          }
        },  

		    cssmin:{
           dist: {
              options: {
                 banner: ''
              },
              files: {
                 'src/tmp/style.min.css': ['src/tmp/style.urlrw.css']
              }
          }
        },
       
        processhtml: {
          options: {
            data: {
              message: 'Hello world!'
            }
          },
          dist: {
            files: {
              'index.html': ['src/index.html']
            }
          }
        }        

	});


    grunt.registerTask('default', ['jshint', 'concat','uglify','css_url_replace','cssUrlRewrite','cssmin','processhtml']);
};