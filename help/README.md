## Generate help pages from project wiki using h5bp documentation generator

### Install h5bp-docs

See [h5bp-docs](https://github.com/mklabs/h5bp-docs) readme

Unfortunately, h5bp-docs does not work on Windows. Until we find an alternative, the tool needs to be run on a unix-like 
system. The results are stored in a subdirectory for deployment on Windows.

### Usage

Clone the wiki repository, 'https://github.com/uo-lca/CalRecycleLCA.wiki.git'.

H5bp-docs seems to have some trouble with repository paths that do not have a common parent. Therefore, clone CalRecycleLCA.wiki.git into the same directory where CalRecycleLCA.git is cloned.

cd to this directory (CalRecycleLCA/FrontEnd/help) in your local CalRecycleLCA.git repository.

Execute

`h5bp-docs --src ../../../CalRecycleLCA.wiki --config conf/config.js`

append `--server` flag to start a static server that will host the generated directory. 

After wiki has been updated, pull changes and rerun command above.

#### File generation

The h5bp-docs command creates files under `home`, the root of the help web site. Commit changes so that they can be deployed 
on Windows.

### Customizing Help

* layout.html is a mustache template file for all html file generation.

It contains references to css files in home. These can be modified to customize help page style.

### Deployment

In IIS, create a web site for help containing the contents of `home`.


