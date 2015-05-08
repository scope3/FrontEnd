## Generate help pages from project wiki using h5bp documentation generator

### Install h5bp-docs

    See README in [https://github.com/mklabs/h5bp-docs](https://github.com/mklabs/h5bp-docs)

### Usage

    Clone the wiki repository, 'https://github.com/uo-lca/CalRecycleLCA.wiki.git'

    cd to the directory containing this README

    Execute

    h5bp-docs --src *local repository path*CalRecycleLCA.wiki --config conf/config.js

append `--server` flag to start a static server that will host the generated directory. `--baseurl` allows you to change the location where you'd like to test things locally (localhost:4000/docs/ or localhost:4000/wikis/ for example)

#### File generation

    The h5bp-docs command creates files under home, the root of the help web site

### Customizing Help

* layout.html is a mustache template file for html generation in the help web site.

It contains references to css files in home. These can be modified to customize help page style.
