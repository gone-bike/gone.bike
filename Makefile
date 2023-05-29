MAKEFLAGS += --silent

include .env

help:
	sed -rn 's/^([a-zA-Z0-9_-]+):.*?##(.*).*?## (.*)/'$$(tput setaf 99)'make '$$(tput setaf 99)$$(tput bold)'\1|'$$(tput setaf 96)'\2'$$(tput sgr0)'|\3/p' < $(or ${makefile}, Makefile) | sort | column -t -s "|"

update: ## ## Updates codebase & rebuild. Used in production deploy pipeline
	cd astro && npm i
	docker-compose run -it --rm web  npx astro-i18next generate && \
	docker-compose run -it --rm web npm run build && \
	docker-compose up -d web && \
	docker-compose restart web
	docker-compose build worker
	docker-compose up -d worker


sync-s3: ## target=path/to/folder ## Downloads all remote images, creates a tgz archive
	$$(cat .env | grep AWS_ |xargs -L 1 echo export) && \
	aws s3 sync s3://${AWS_S3_BUCKET} ${target}
	tar cfz ${target}/../gone.bike.images.`date +"%Y-%m-%d`.tgz ${target}

dump-db: ## ## Dumps db, nullifying local references to users
	docker-compose up -d postgresql
	docker-compose exec postgresql pg_dump -U postgres --data-only \
	 -t language -t bike_brand -t bike_brand_model -t report -t report_files \
	 -t directus_files -t directus_folders >  gone-bike.db.dump.`date +"%Y%m%d"`.sql
	docker-compose exec postgresql psql -U postgres -c "COPY (SELECT id FROM directus_users) TO STDOUT" | while read id; do \
		sed -i "s/$$id/\\\N/g" gone-bike.db.dump.`date +"%Y%m%d"`.sql; \
	done

delete-old-tmp: ## ## Shortcut to remove files in temporary upload folder
	find astro/public/tmp/ -mmin +459 -type f -print | grep -v 'tmp/\.gitignore$$' | xargs -r -L 1 rm -fv
