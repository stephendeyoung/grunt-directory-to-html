# grunt-directory-to-html

> Generate an html page from a directory structure. This can be useful for automatically creating a homepage for a project. For example, given this directory structure:

```
└── modules
    ├── another_test_link
    │   └── index.html
    └── test_link
        └── nested_test_link
            └── index.html
```

The plugin will generate this html:

```html
<ul>
  <li>
    <h2><a href="modules/another_test_link/index.html">Another test link</a>
    </h2>
  </li>
  <li>
    <h2>Test link
    </h2>
    <ul>
      <li>
        <h3><a href="modules/test_link/nested_test_link/index.html">Nested test link</a>
        </h3>
      </li>
    </ul>
  </li>
</ul>
```

## How it works

Based on the file paths you specify in your `grunt.initConfig` (see below) the plugin will create html markup that reflects this directory structure using unordered lists and will create links to any matching files it finds. The plugin will use the names of directories to generate the titles in the html. For example, a directory name of `test_folder_link` will become 'Test folder link' in the html (you can use dashes in the folder name instead of underscores).

## Specifying your own data to use

If you want to specify your own title then you can create a `data.json` file in the directory in which you want to override the default behaviour. For example, given this directory structure:

```
└── modules
    ├── another_test_link
    │   ├── data.json
    │   └── index.html
    └── test_link
        └── nested_test_link
            └── index.html
```

And the `data.json` file contains this data:

```json
{
    "title": "Your own title",
    "description": "A description"
}
```

The plugin will generate this html:

```html
<ul>
  <li>
    <h2><a href="modules/another_test_link/index.html">Your own title</a>
    </h2>
    <p>A description</p>
  </li>
  <li>
    <h2>Test link
    </h2>
    <ul>
      <li>
        <h3><a href="modules/test_link/nested_test_link/index.html">Nested test link</a>
        </h3>
      </li>
    </ul>
  </li>
</ul>
```
The default template will look for the `title` and `description` properties. You can specify your own data that will be rendered into the html but you will need to supply your own template (see the section below on templates).

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-directory-to-html --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-directory-to-html');
```

## The "to_html" task

### Overview
In your project's Gruntfile, add a section named `to_html` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  to_html: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here e.g.
      'dest/index.html': 'modules/**/index.html'
    }
  }
})
```

or

```js
grunt.initConfig({
  to_html: {
    'dest/index.html': 'modules/**/index.html'
  }
})
```

### Options

#### options.rootDirectory
Type: `String`
Default value: `modules`

The root directory which contains the folders you want to link to in the html. You must ensure this is specified correctly otherwise the html that is generated will be incorrect.

#### options.generatePage
Type: `Boolean`
Default value: `false`

If set to `true` this will create a full html page (including doctype and `<head>`). By default the plugin will only generate an html structure that corresponds to the directory structure.

#### options.title
Type: `String`
Default value: `Project homepage`

If the `generatePage` option is `true` then the value that is supplied to the `title` option will be used as the text for the `<title>` and `<h1>` of the page.

#### options.stylesheet
Type: `String`
Default value: `false`

If the `generatePage` option is `true` then the page that is output will link to a stylesheet with the `href` value set to whatever value is supplied to the `stylesheet` option.

#### options.template
Type: `String` (jade or handlebars template)
Default value: `false`

Provide your own template to generate the html markup. Please see the templates section below for more information about how to write your own template.

#### options.templatingLanguage
Type: `String`
Default value: `jade`

If this option is set to `handlebars` and a template is provided to the `template` option then the plugin will use handlebars to compile the template.

### Templates

By default the plugin will use jade to compile the template, however, you can use handlebars instead.

#### Understanding templates

When the `directory-to-html` task is run it will construct an object that reflects the directory structure. For example, given this folder structure:

```
└── modules
    ├── another_test_link
    │   └── index.html
    └── test_link
        └── nested_test_link
            └── index.html
```

The following object will be created:

```js
{
  modules: [
    {
      id: 'another_test_link',
      title: 'Another test link',
      path: 'modules/another_test_link/index.html',
      level: 0
    },
    {
      id: 'test_link',
      title: 'Test link',
      level: 0,
      children: [
        {
         id: 'nested_test_link',
         title: 'Nested test link',
         path: 'modules/test_link/nested_test_link/index.html',
         level: 1
        }
      ]
    }
  ]
}
```

This object is then passed to the template for html rendering.

If you create a `data.json` file in a directory all of the data in that file will be added to the object and sent to the template. For example, given this directory structure:

```
└── modules
    ├── another_test_link
        ├── data.json
        └── index.html
```

And the `data.json` contains this data:

```json
{
  "title": "Your own title",
  "description": "Lorem ipsum dolor."
  "randomData": [
    {
      "test": "test 1"
    },
    {
      "test": "test 2"
    }
  ]
}
```

Then the following object will be created:

```js
{
  modules: [
    {
      id: 'another_test_link',
      title: 'Your own title',
      description: 'Lorem ipsum dolor.',
      randomData: [
        {
          test: 'test 1'
        },
        {
          test: 'test 2'
        }
      ]
      path: 'modules/another_test_link/index.html',
      level: 0
    }
  ]
}
```

In this way if you create your own template and `data.json` files you can generate html that suits your needs.

#### Writing a jade template

By default the plugin uses [jade](http://jade-lang.com/) to generate the html. Here is the default template that the plugin uses:

```
mixin title(module)
    if module.path
        a(href=module.path)= module.title
    else
        = module.title

mixin generateTemplate(modules)
    ul
        each module in modules
            li
                case module.level
                    when 0
                        h2
                            +title(module)
                    when 1
                        h3
                            +title(module)
                    when 2
                        h4
                            +title(module)
                    when 3
                        h5
                            +title(module)
                    default
                        h6
                            +title(module)

                if module.description
                    p= module.description

                if module.children
                    mixin generateTemplate(module.children)

+generateTemplate(modules)

```

From this you should be able to determine how to write your own jade template. Note that the template uses the `generateTemplate` mixin so that it can recurse through the object structure.

#### Writing a handlebars template

You can use a [handlebars](http://handlebarsjs.com/) template instead of jade as long as you specify `handlebars` as the value to the `templatingLanguage` option. Here is an example handlebars template:

```
<ul>
    {{#each modules}}
    <li>
        {{#if path}}
        <h2>
            <a href="{{path}}">{{title}}</a>
        </h2>
        {{else}}

        <h2>{{title}}</h2>

        {{/if}}

        {{#if description}}
        <p>{{description}}</p>
        {{/if}}

        {{#if children}}
            {{&recurse children}}
        {{/if}}
    </li>
    {{/each}}
</ul>
```

From this you should be able to determine how to write your own handlebars template. Note that the plugin registers a helper `recurse` so that you can recurse through the object structure.
