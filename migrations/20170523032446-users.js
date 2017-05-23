'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.runSql("CREATE TABLE `user` (\
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
    `firstname` varchar(255) DEFAULT NULL,\
    `surname` varchar(255) DEFAULT NULL,\
    `email` varchar(255) DEFAULT NULL,\
    `password` varchar(255) DEFAULT NULL,\
    `terms` tinyint(1) DEFAULT '0',\
    `createdAt` datetime DEFAULT NULL,\
    `updatedAt` datetime DEFAULT NULL,\
    PRIMARY KEY (`id`),\
    UNIQUE KEY `email` (`email`)\
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8");
};

exports.down = function(db) {
  return db.runSql("DROP TABLE `user`");
};

exports._meta = {
  "version": 1
};