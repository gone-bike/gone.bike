MAKEFLAGS += --silent

include .env

help:
	sed -rn 's/^([a-zA-Z0-9_-]+):.*?##(.*).*?## (.*)/'$$(tput setaf 99)'make '$$(tput setaf 99)$$(tput bold)'\1|'$$(tput setaf 96)'\2'$$(tput sgr0)'|\3/p' < $(or ${makefile}, Makefile) | sort | column -t -s "|"

update: ## ## Updates codebase & rebuild. Used in production deploy pipeline
	cd astro && npm i
	rm -rf astro/src/pages/{it,es,fr}/* && \
	docker-compose run -it --rm web  npx astro-i18next generate && \
	docker-compose run -it --rm web npm run build && \
	docker-compose up -d web && \
	docker-compose restart web
	docker-compose build worker
	docker-compose up -d worker


sync-s3: ## target=path/to/folder ## Downloads all remote images, creates a tgz archive, with a symlink to `latest`
	$$(cat .env | grep AWS_ |xargs -L 1 echo export) && \
	aws s3 sync s3://${AWS_S3_BUCKET} ${target}
	cd ${target} && tar cfz ../gone.bike.images.`date +"%Y-%m-%d"`.tgz . && \
	cd .. && rm -f gone.bike.images.latest.tgz && \
	ln -s gone.bike.images.`date +"%Y-%m-%d"`.tgz gone.bike.images.latest.tgz

dump-db: ## target=path/to/folder ## Dumps db, nullifying local references to users
	docker-compose up -d postgresql
	docker-compose exec postgresql pg_dump -U postgres \
	 -t language -t bike_brand -t bike_brand_model -t report -t report_files -t i18n -t i18n_translation \
	 -t directus_users -t directus_roles -t directus_files -t directus_folders | gzip -c > gone.bike.db-pre-dump.`date +"%Y%m%d"`.sql.gz
	docker-compose exec postgresql psql -U postgres -c "DROP DATABASE dump;" || true
	docker-compose exec postgresql psql -U postgres -c "CREATE DATABASE dump;"
	docker-compose exec postgresql psql -U postgres -d dump -c "CREATE EXTENSION postgis;"

	gunzip -c gone.bike.db-pre-dump.`date +"%Y%m%d"`.sql.gz | docker-compose exec -T postgresql psql -U postgres -d dump
	rm -f gone.bike.db-pre-dump.`date +"%Y%m%d"`.sql.gz;

	docker-compose exec postgresql psql -U postgres -d dump -c "UPDATE directus_files SET storage = 'local', modified_by = NULL, uploaded_by = NULL;"
	docker-compose exec postgresql psql -U postgres -d dump -c "UPDATE report SET user_created = NULL, user_updated = NULL, email = NULL;"
	docker-compose exec postgresql psql -U postgres -d dump -c "UPDATE i18n_translation SET user_updated = NULL;"
	docker-compose exec postgresql psql -U postgres -d dump -c "DELETE FROM directus_users;"
	docker-compose exec postgresql psql -U postgres -d dump -c "DELETE FROM directus_roles;"


	docker-compose exec postgresql pg_dump -U postgres -d dump --data-only \
	 -t language -t bike_brand -t bike_brand_model -t report -t report_files -t i18n -t i18n_translation \
	 -t directus_files -t directus_folders | gzip -c > gone.bike.db-dump.`date +"%Y%m%d"`.sql.gz

	mv -v gone.bike.db-dump.`date +"%Y%m%d"`.sql.gz ${target} && \
	cd ${target} && rm -f gone.bike.db-dump.latest.sql.gz && \
	ln -s gone.bike.db-dump.`date +"%Y%m%d"`.sql.gz gone.bike.db-dump.latest.sql.gz

	docker-compose exec postgresql psql -U postgres -c "DROP DATABASE dump;" || true




delete-old-tmp: ## ## Shortcut to remove files in temporary upload folder
	find astro/public/tmp/ -mmin +459 -type f -print | grep -v 'tmp/\.gitignore$$' | xargs -r -L 1 rm -fv




delete-weaviate-report-files: ## id=x ## Deletes all indexed entries from Weaviate related to a report id
	curl -s \
		-X GET \
		-H "Content-Type: application/json" \
		-d '{"class": "Bike", "properties": { "report_id": '${id}' } }' \
		${WEAVIATE_URI}/v1/objects | jq -c -M -r '.objects[] | del(.properties.image)' | \
	jq -r .id | while read wid; do \
		echo "Deleting $$wid ..." && \
		curl -X DELETE ${WEAVIATE_URI}/v1/objects/Bike/$$wid; \
	done