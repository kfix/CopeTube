#!/usr/bin/make -f
VERSION		 := 1.0
LAST_TAG	 != git describe --abbrev=0 --tags
USER		 := kfix
REPO		 := CopeTube
ZIP			 := $(REPO).zip
GH_RELEASE_JSON = '{"tag_name": "v$(VERSION)","target_commitish": "master","name": "v$(VERSION)","body": "$(REPO) build of version $(VERSION)","draft": false,"prerelease": true}'
MacPin		?= ${HOME}/src/MacPin

all: $(REPO).app
$(REPO).app: $(MacPin)/Makefile browser/$(REPO)/
	$(MAKE) -C $(MacPin) macpin_sites=$(PWD)/browser appdir=$(PWD) icondir=$(PWD) appsig='' $(PWD)/$@
	plutil -replace MacPin-AppScriptName -string "macpin" $@/Contents/Info.plist

browser/%/: icon.png macpin.js index.html css fonts app lib
	install -d $@
	for i in $+; do [ ! -e $$i ] || ln -sf ../../$$i $@/; done
	touch $@

gh-pages: browser/$(REPO)/
	cp -RL $</* dist/$@
	cd dist/$@; git add *; git commit; git push origin HEAD:$@
	git add dist/$@
	git commit
	git push

test: browser/$(REPO)/index.html
	open $<
test.chrome: browser/$(REPO)/index.html
	open -a "Google Chrome.app" --args --disable-web-security $<
test.macpin:
	(open -a MacPin.app --args -i $(PWD)/index.html)
test.app: $(REPO).app/Contents/MacOS/$(REPO)
	($^ -i)

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

.PRECIOUS: build/%
.PHONY: clean all test test.app test.chrome gh_pages
