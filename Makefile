update:
	cd astro && npm i
	docker-compose run -it --rm web npm run build
	docker-compose up -d web
	docker-compose restart web

