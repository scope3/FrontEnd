
exports = module.exports = {
  // --server, when set to true, will start a connect static server once generation is done
  server: false,

  // server port used if --server flag provided
  port: 4000,

  // destination folder, place where the generated files will land
  dest: "./home",

  // a single layout files with a {{ content }} placeholder.
  layout: "./layout.html",

  // Use a custom layout for MyCustom and TOC.
  // Don't include the extension when specifying the file names.
  customLayout: {'MyCustom': './custom.html',
                 'TOC':  './toc.html'},

  // allowed extensions, all other files are ignored 
  ext: ['md', 'markdown', 'mkd'],

  // Exclude some paths/directories. This is a list of JS regular expressions.
  exclude: [],

  // How to replace the {{{ edit }}} placeholder. Must contain ":filename" somewhere.
  edit: '<a class="edit-page" href="http://github.com/uo-lca/CalRecycleLCA/wiki/Home/_edit">Edit this page</a>',

  // baseurl, only used with --server flag. ex: docs
  // also it helps to prefix links with some path
  baseurl: '',

  // Enable verbose output (defaults false)
  verbose: true
};
