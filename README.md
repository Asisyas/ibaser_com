REQUIRED:
  * docker
  * docker-composer

RUN IT:
  *  docker-composer up -d
  *  open: http://localhost:8080 


BUILD THEME ( Rebuild after scss changes )
 * docker-compose exec nodejs bash
 * npm install
 * npm run-script build

WEB
 * http://localhost:8080 front
 * http://localhost:8080/wp-admin admin


CREDENTIALS
    admin/admin

RESTORE ALL CHANGES:

  * Remove all data from docker/db/*
