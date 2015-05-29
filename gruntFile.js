module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-html2js');

  //grunt.registerTask('release', ['clean','html2js','concat', 'uglify', 'copy', 'bower_concat']);
  grunt.registerTask('release', ['clean','html2js','concat:css', 'concat:index', 'uglify', 'copy', 'bower_concat']);

  // Project configuration.
  grunt.initConfig({
    buildDir: 'bld',
    distDir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    '<%= pkg.copyright ? " * " + pkg.copyright + "\\n" : "" %>' +
    ' */\n',
    minFile: '<%= pkg.name %>.min.js',
    concatFile: '<%= pkg.name %>.cc.js',
    src: {
      jsApp: ['app/**/*.js', '!app/bower_components/**/*.js', '!app/components/resource-mocks/*.js', '!app/**/*_test.js',
        '!app/**/placeholder.js', '!app/**/config.js'],
      cssApp: ['app/**/*.css', '!app/bower_components/**/*.css'],
      plugins: [
        'app/bower_components/d3-plugins/sankey/sankey.js',
        'app/bower_components/ng-grid/plugins/ng-grid-flexible-height.js'
      ],
      jsTpl: ['<%= buildDir %>/templates/**/*.js'],
      html: ['<%= buildDir %>/index.html'],
      tpl: {
        app: ['app/**/*.html', '!app/bower_components/**/*.html', '!app/index.html']
      },
      less: [], // recess:build doesn't accept ** in its file patterns
      lessWatch: []
    },
    clean: [ '<%= buildDir %>/*.js' , '<%= distDir %>/*'],
    copy: {
      assets: {
        files: [{ dest: '<%= distDir %>', src : 'favicon.ico', expand: true, cwd: 'app' }]
      },
      config: {
        files: [{ dest: '<%= distDir %>', src : 'config.js', expand: true, cwd: 'app' }]
      }
    },
    html2js: {
      app: {
        options: {
          base: 'app'
        },
        src: ['<%= src.tpl.app %>'],
        dest: '<%= buildDir %>/templates.js',
        module: 'lcaApp.html'
      }
    },
    concat:{
      css: {
        src: [ '<%= src.cssApp %>' ],
        dest: '<%= distDir %>/<%= pkg.name %>.css'
      },
      js:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.jsApp %>'],
        dest:'<%= distDir %>/<%= pkg.name %>.js'
      },
      index: {
        src: ['<%= buildDir %>/index.html'],
        dest: '<%= distDir %>/index.html',
        options: {
          process: true
        }
      }
    },
    uglify: {
      jsApp:{
        options: {
          banner: "<%= banner %>",
          mangle: false
        },
        src: ['<%= src.jsApp %>', '<%= buildDir %>/templates.js'],
        dest: '<%= distDir %>/<%= minFile %>'
      },
      plugins: {
        src: ['<%= src.plugins %>'],
        dest: '<%= distDir %>/plugins.min.js'
      }
    },
    bower_concat: {
      all: {
        dest: 'dist/_bower.js',
        cssDest: 'dist/_bower.css',
        exclude: [
            'bootstrap',
          'jquery',
          'angular',
          'angular-mocks',
          'd3-plugins'
        ],
        callback: function(mainFiles) {
          return mainFiles.map( function(filepath) {
            // Use minified files if available
            var min = filepath.replace(/\.js$/, '.min.js');
            return grunt.file.exists(min) ? min : filepath;
          });
        }
      }
    }
  });

};
