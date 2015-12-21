#!/usr/bin/make -f
VERSION		 := 1.0
LAST_TAG	 != git describe --abbrev=0 --tags
USER		 := kfix
REPO		 := CopeTube
ZIP			 := $(REPO).zip
GH_RELEASE_JSON = '{"tag_name": "v$(VERSION)","target_commitish": "master","name": "v$(VERSION)","body": "$(REPO) build of version $(VERSION)","draft": false,"prerelease": true}'
MacPin		?= ${HOME}/src/MacPin

all: $(REPO).app

%.app: $(MacPin)/Makefile browser/%
	$(MAKE) -C $(MacPin) macpin_sites=$(PWD)/browser appdir=$(PWD) icondir=$(PWD) appsig='' $(PWD)/$@
	plutil -replace MacPin-AppScriptName -string "macpin" $@/Contents/Info.plist

browser/%: icon.png macpin.js index.html jspm_packages css fonts config.js build.js build.js.map lib
	#ln -sf $(PWD) $@
	install -d $@
	for i in $+; do [ ! -e $$i ] || ln -sf ../../$$i $@/; done
	touch $@

# https://github.com/jspm/jspm-cli/blob/master/docs/production-workflows.md
# `jspm *` unnecessarily touches config.js & package.json, screws up mtime-based dependencies
#   may be fixed in 0.17: https://github.com/jspm/jspm-cli/issues/1133

build.js build.js.map: lib $(wildcard lib/*.js) package.json config.js
	jspm bundle lib/main - react - react-dom - react-formable build.js

config.js jspm_packages: package.json
	#jspm install

#node_modules: package.json
#	npm install
#	touch $@
#jspm: node_modules
#	jspm init -p
#	jspm dl-loader babel

gh-pages: browser/$(REPO)
	cp -RL $</* dist/$@
	cd dist/$@; git add *; git commit; git push origin HEAD:$@
	git add dist/$@
	git commit
	git push

browser/$(REPO)/index.html: browser/$(REPO)
test: browser/$(REPO)/index.html
	open $<
test.chrome: browser/$(REPO)/index.html
	open -a "Google Chrome.app" --args --disable-web-security $<
test.macpin: build.js
	(exec -a CopeTube macpin -i $(PWD)/index.html)
test.app: $(REPO).app/Contents/MacOS/$(REPO)
	($^ -i)

# http://caspervonb.com/javascript/an-overview-of-javascript-in-2015-ecmascript-6/
# http://babeljs.io/docs/usage/cli/
%.js: %.es6
	babel $< -o $@

install: $(REPO).app
	cp -R $< ~/Applications

clean:
	-rm -rf browser build.* *.app

tag:
	git tag -f -a v$(VERSION) -m 'release $(VERSION)'

$(ZIP): tag
	rm $(ZIP) || true
	zip -no-wild -r $@ $(allapps) --exclude .DS_Store

ifneq ($(GITHUB_ACCESS_TOKEN),)
release: clean allapps $(ZIP)
	git push -f --tags
	posturl=$$(curl --data $(GH_RELEASE_JSON) "https://api.github.com/repos/$(USER)/$(REPO)/releases?access_token=$(GITHUB_ACCESS_TOKEN)" | jq -r .upload_url | sed 's/[\{\}]//g') && \
	dload=$$(curl --fail -X POST -H "Content-Type: application/gzip" --data-binary "@$(ZIP)" "$$posturl=$(ZIP)&access_token=$(GITHUB_ACCESS_TOKEN)" | jq -r .browser_download_url | sed 's/[\{\}]//g') && \
	echo "$(REPO) now available for download at $$dload"
else
release:
	@echo You need to export \$$GITHUB_ACCESS_TOKEN to make a release!
	@exit 1
endif

.PRECIOUS: build/% .babel/%
.PHONY: clean all test test.app test.chrome gh_pages
