#!/usr/bin/make -f
VERSION		 := 1.0
LAST_TAG	 != git describe --abbrev=0 --tags
USER		 := kfix
REPO		 := CopeTube
ZIP			 := $(REPO).zip
GH_RELEASE_JSON = '{"tag_name": "v$(VERSION)","target_commitish": "master","name": "v$(VERSION)","body": "$(REPO) build of version $(VERSION)","draft": false,"prerelease": true}'

dist dist/index.html: index.html src/lib/*.js src/lib/*.svelte src/*.svelte
	npx vite build
	touch $@

dist/.git:
	git worktree add dist gh-pages

gh-pages: dist/.git
	cd dist/; \
		git fetch; \
		git reset --hard origin/gh-pages; \
		git add --all; \
		git commit -m "Deploy to gh-pages"; \
		git push origin gh-pages

node_modules: package.json
	npm install
	touch $@

run-dev: node_modules
	npm run dev -- --open

test: dist/index.html
	open $<
test.chrome: dist/index.html
	(open -a "Google Chrome.app" file://$(PWD)/$< --args '--disable-web-security' '--user-data-dir=' '--allow-file-access-from-files')
test.edge: dist/index.html
	(open -a "Microsoft Edge.app" file://$(PWD)/$< --args '--disable-web-security' '--user-data-dir=' '--allow-file-access-from-files')
test.ff: dist/index.html
	# about:config -> security.fileuri.strict_origin_policy=false
	(open -a "Firefox.app" file://$(PWD)/$< )
test.macpin: dist/index.html
	(open -a MacPin.app --args -i file://$(PWD)/$<)
test.app: $(REPO).app/Contents/MacOS/$(REPO)
	($^ -i)

install: $(REPO).app
	cp -R $< ~/Applications

clean:
	-rm -rf browser *.app dist/*

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
.PHONY: clean all run-dev test test.app test.chrome test.edge gh-pages
