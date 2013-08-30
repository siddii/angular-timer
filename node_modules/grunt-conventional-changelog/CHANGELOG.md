# 0.1.2 (2013-06-23)



## Bug fixes
### log

* correctly generate links to GitHub commits ([de15bde5](https://github.com/btford/grunt-conventional-changelog/commit/de15bde5))




# 0.1.1 (2013-06-11)



## Bug fixes
### task

* Fix shelljs dependency problem ([2db8cf96](https://github.com/btford/grunt-conventional-changelog/commit/2db8cf96))




# 0.1.0 (2013-05-30)

## Features
### log

* dogfooding - this task uses itself to generate its own changelogs ([746e9ffc](https://github.com/btford/grunt-conventional-changelog/commit/746e9ffc))

* Add breaking changes section ([04ecfceb](https://github.com/btford/grunt-conventional-changelog/commit/04ecfceb))

* Add smart 'github' option for commit links ([6ac1083a](https://github.com/btford/grunt-conventional-changelog/commit/6ac1083a))

### changelog

* allow 'version' option, to use instead of 'pkg.version' ([4a06569a](https://github.com/btford/grunt-conventional-changelog/commit/4a06569a))

* Allow 'enforce' option: Adds a git hook for commit conventions ([1cbe92cf](https://github.com/btford/grunt-conventional-changelog/commit/1cbe92cf))



## Bug fixes
### gruntfile

* load package.json ([8c4cb685](https://github.com/btford/grunt-conventional-changelog/commit/8c4cb685))

### task

* version regex now matches the commit messages created by `npm version` by default ([db3985d2](https://github.com/btford/grunt-conventional-changelog/commit/db3985d2))

* fix issue when no changelog exist yet ([c1a31f56](https://github.com/btford/grunt-conventional-changelog/commit/c1a31f56))







# 0.0.12 (2013-04-06)

## Features
### log

* automatically split notes based on release version (5545fe4)

* dogfooding - this task uses itself to generate its own changelogs (746e9ff)

### readme

* improve the readme (0aeec47)



## Bug fixes
### gruntfile

* load package.json (2319bd3)


