REQUIRED:
  * docker
  * docker-composer

RUN IT:
  *  docker-composer up -d
  *  open: http://localhost:8080 


WEB
 * http://localhost:8080 front
 * http://localhost:8080/wp-admin admin


CREDENTIALS
    admin/admin

RESTORE ALL CHANGES:

  * Remove all data from docker/db/*
