#!/usr/bin/make -f
VERSION		 := 1.0
LAST_TAG	 != git describe --abbrev=0 --tags
USER		 := kfix
REPO		 := CopeTube
ZIP			 := $(REPO).zip
GH_RELEASE_JSON = '{"tag_name": "v$(VERSION)","target_commitish": "master","name": "v$(VERSION)","body": "MacPin build of version $(VERSION)","draft": false,"prerelease": true}'
MacPin		?= ${HOME}/src/MacPin

all: $(REPO).app

deps:
	brew install npm
	npm install -g bower
	bower install --save react

%.app: $(MacPin)/Makefile browser/%
	$(MAKE) -C $(MacPin) macpin_sites=$(PWD)/browser appdir=$(PWD) icondir=$(PWD) appsig='' $(PWD)/$@
	plutil -replace MacPin-AppScriptName -string "macpin" $@/Contents/Info.plist

browser/%: .babel icon.png macpin.js js/ html/ bower_components/
	install -d $@
	for i in .babel/* icon*.png macpin.js js/* bower_components/ html/*; do [ ! -e $$i ] || ln -sf ../../$$i $@/; done

.babel: es6
	babel $< --out-dir $@ --source-maps --source-maps-inline

bower_components:
	bower install

gh-pages: browser/$(REPO)
	cp -RL $</* dist/$@
	cd dist/$@; git add *; git commit; git push origin HEAD:$@
	git add dist/$@
	git commit
	git push

test: browser/$(REPO)
	open $</index.html

test.chrome: browser/$(REPO)
	open -a "Google Chrome.app" $</index.html

test.app: $(REPO).app
	open $<

# http://caspervonb.com/javascript/an-overview-of-javascript-in-2015-ecmascript-6/
# http://babeljs.io/docs/usage/cli/
%.js: %.es6
	babel $< -o $@

install: $(REPO).app
	cp -R $< ~/Applications

clean:
	-rm -rf browser build *.app

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
.PHONY: clean all test test.app test.chrome
