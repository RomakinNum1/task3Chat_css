down:
	docker-compose down
start:
	docker-compose up -d
init:
	cd composer && composer install
	docker-compose up -d mysqldb
	while [make migration];
migration:
	migrate -path=web/migrations/ -database "mysql://root:root@tcp(task2.loc:8989)/test" up


