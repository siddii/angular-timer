# grunt-bump

**Bump package version, create tag, commit, push...**

## Installation

Install npm package, next to your project's `Gruntfile.js` file:

    npm install grunt-bump --save-dev

Add this line to your project's `Gruntfile.js`:

    grunt.loadNpmTasks('grunt-bump');


## Usage

Let's say current version is `0.0.1`.

````
grunt bump
>> Version bumped to 0.0.2
>> Committed as "Release v0.0.2"
>> Tagged as "v0.0.2"
>> Pushed to origin

grunt bump:patch
>> Version bumped to 0.0.3
>> Committed as "Release v0.0.2"
>> Tagged as "v0.0.2"
>> Pushed to origin
````

## Configuration

This shows all the available config options with their default values.

```js
bump: {
  files: ['package.json'],
  updateConfigs: [],
  commit: true,
  commitMessage: 'Release v%VERSION%',
  commitFiles: ['package.json'], // '-a' for all files
  createTag: true,
  tagName: 'v%VERSION%',
  tagMessage: 'Version %VERSION%',
  push: true,
  pushTo: 'origin'
}
```

### files
List of files to bump. Maybe you wanna bump 'component.json' as well ?

### updateConfigs
Sometimes you load the content of `package.json` into a grunt config. This will update the config property, so that even tasks running in the same grunt process see the updated value.

```js
bump: {
  files:         ['package.json', 'component.json'],
  udpateConfigs: ['pkg',          'component']
}
```

### commit
Do you wanna commit the changes ?

### commitMessage
If so, what is the commit message ? You can use `%VERSION%` which will get replaced with the new version.

### commitFiles
An array of files that you wanna commit. You can use `['-a']` to commit all files.

### createTag
Do you wanna create a tag ?

### tagName
If so, this is the name of that tag (`%VERSION%` placeholder is available).

### tagMessage
Yep, you guessed right, it's the message of that tag - description (`%VERSION%` placeholder is available).

### push
Do you wanna push all these changes ?

### pushTo
If so, which remote branch would you like to push to ?
