module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-html2js');

  grunt.registerTask('test', ['clean','html2js','concat','copy', 'bower_concat']);
  grunt.registerTask('release', ['clean','html2js','uglify','concat:index', 'concat:css','copy', 'bower_concat']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  // Project configuration.
  grunt.initConfig({
    builddir: 'bld',
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    src: {
      js: ['app/**/*.js', '!app/bower_components/**/*.js', '!app/**/*_test.js', '!app/**/placeholder.js'],
      plugins: [
        'app/bower_components/d3-plugins/sankey/sankey.js',
        'app/bower_components/ng-grid/plugins/ng-grid-flexible-height.js'
      ],
      jsTpl: ['<%= builddir %>/templates/**/*.js'],
      specs: ['app/**/*_test.js'],
      html: ['<%= builddir %>/index.html'],
      tpl: {
        app: ['app/**/*.html', '!app/bower_components/**/*.html']
      },
      less: [], // recess:build doesn't accept ** in its file patterns
      lessWatch: []
    },
    clean: ['<%= distdir %>/*'],
    copy: {
      assets: {
        files: [{ dest: '<%= distdir %>', src : 'favicon.ico', expand: true, cwd: 'app' }]
      },
      config: {
        files: [{ dest: '<%= distdir %>', src : 'config.js', expand: true, cwd: 'app' }]
      }
    },
    html2js: {
      app: {
        options: {
          base: 'app'
        },
        src: ['<%= src.tpl.app %>'],
        dest: '<%= builddir %>/templates/app.js',
        module: 'lcaApp.html'
      }
    },
    concat:{
      css: {
        src: [
          'app/**/*.css', '!app/bower_components/**/*.css'
        ],
        dest: '<%= distdir %>/<%= pkg.name %>.css'
      },
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>', '<%= src.jsTpl %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      index: {
        src: ['<%= builddir %>/index.html'],
        dest: '<%= distdir %>/index.html',
        options: {
          process: true
        }
      }
    },
    uglify: {
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>' ,'<%= src.jsTpl %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.min.js'
      },
      plugins: {
        src: ['<%= src.plugins %>'],
        dest: '<%= distdir %>/plugins.min.js'
      }
    },
    bower_concat: {
      all: {
        dest: 'dist/_bower.js',
        cssDest: 'dist/_bower.css',
        exclude: [
          'jquery',
          'angular',
          'angular-mocks',
          'd3-plugins'
        ],
        callback: function(mainFiles, component) {
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
