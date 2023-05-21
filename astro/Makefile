MAKEFLAGS += --silent
SHELL = /bin/bash -o pipefail

include .env

# make sure is always the first command
help:
	sed -rn 's/^([a-zA-Z0-9_-]+):.*?##(.*).*?## (.*)/'$$(tput setaf 99)'make '$$(tput setaf 99)$$(tput bold)'\1|'$$(tput setaf 96)'\2'$$(tput sgr0)'|\3/p' < $(or ${makefile}, Makefile) | sort | column -t -s "|"

fetch-locales-json: ## # ## Fetches the whole translation file from content db
	echo "Fetching translations...";
	curl -s --fail --show-error \
	    -H "CF-Access-Client-Id: ${CF_ACCESS_CLIENT_ID}" \
	    -H "CF-Access-Client-Secret: ${CF_ACCESS_CLIENT_SECRET}" \
	    ${DIRECTUS_FLOW_I18N} > .tmp.i18n.json



split-locales: fetch-locales-json ## # ## splits the single file into astro-i18next format
	cat .tmp.i18n.json | jq -r 'keys[]' | while read l; do \
		mkdir -p public/locales/$$l && \
		echo "Splitting $$l ..." && \
		cat .tmp.i18n.json | jq ".$$l" > public/locales/$$l/translation.json; \
	done;
	rm -f .tmp.i18n.json

generate-locales: split-locales ## ## Merges sub-languages with parent languages
	find public/locales/ -type d -name "*_*" | xargs --no-run-if-empty -L 1 basename | while read l; do \
		echo "Merging $$l ..." && \
		PARENT=`echo $$l | cut -f1 -d_` && \
			jq -s '.[0] * .[1]' public/locales/$$l/translation.json public/locales/$$PARENT/translation.json > public/locales/$$l/.tmp.json && \
			mv public/locales/$$l/.tmp.json public/locales/$$l/translation.json; \
	done
