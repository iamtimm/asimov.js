install:
	@npm install
	@npm install -g nodemon

start:
	@nodemon main.js

test:
	@node main.js --test

test-watch:
	@nodemon main.js --test

publish:
	@npm publish
	@git tag "v$(shell node -e "var config = require('./package.json'); console.log(config.version);")"
	@git push --tags

.PHONY: install start test coverage publish