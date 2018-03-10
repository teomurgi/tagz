'use strict';
const path = require('path');
const _ = require('lodash');
const Promise = require('./promise');
const sqlite3 = Promise.promisifyAll(require('sqlite3'));

const logger = require('./logger');
const dbUtils = require('./database');


const addTagToFile = (filePath, fileName, tag) => {
  const db = new sqlite3.Database(path.join(filePath, '__tagz'));
  return initDb(db)
    .then(() => {
      return db.getAsync(`SELECT tags FROM files WHERE fileName = ?`, fileName);
    })
    .then((result) => {

      if(result) {
        const tags = tagsToArray(result.tags);
        const newTags = tagsToString(_.union(tags, [tag]));
        return db.runAsync(`UPDATE files SET tags = ? WHERE fileName = ?`, newTags, fileName);
      } else {
        return db.runAsync(`INSERT INTO files VALUES (?,?)`, fileName, tag+dbUtils.TAGS_SEPARATOR);
      }

    })
    .then(() => {
      return db.getAsync(`SELECT tags FROM files WHERE fileName = ?`, fileName);
    })
    .then((result) => {
      return [db.closeAsync(), result.tags];
    })
    .spread((err, tags) => {
      if(err) throw err;
      return tagsToArray(tags);
    })
    .catch((e) => {
      logger.error(e);
      return db.closeAsync();
    });
}

module.exports.addTagToFile = addTagToFile;

const removeTagFromFile = (filePath, fileName, tag) => {
  const db = new sqlite3.Database(path.join(filePath, '__tagz'));
  return initDb(db)
    .then(() => {
      return db.getAsync(`SELECT tags FROM files WHERE fileName = ?`, fileName);
    })
    .then((result) => {

      if(result) {
        const tags = tagsToArray(result.tags);
        const newTags = tagsToString(_.pull(tags, tag));
        return db.runAsync(`UPDATE files SET tags = ? WHERE fileName = ?`, newTags, fileName);
      }
    })
    .then(() => {
      return db.getAsync(`SELECT tags FROM files WHERE fileName = ?`, fileName);
    })
    .then((result) => {
      return [db.closeAsync(), result.tags];
    })
    .spread((err, tags) => {
      if(err) throw err;
      return tagsToArray(tags);
    })
    .catch((e) => {
      logger.error(e);
      return db.closeAsync();
    });
}

module.exports.removeTagFromFile = removeTagFromFile;

const getTags = (filePath, fileName) => {
  const db = new sqlite3.Database(path.join(filePath, '__tagz'));
  return initDb(db)
    .then(() => {
      return db.getAsync(`SELECT tags FROM files WHERE fileName = ?`, fileName);
    })
    .then((result) => {
      const tags = result && result.tags || '';
      return [db.closeAsync(), tags];
    })
    .spread((err, tags) => {
      if(err) throw err;
      return tagsToArray(tags);
    })
    .catch((e) => {
      logger.error(e);
      return db.closeAsync();
    });
}

module.exports.getTags = getTags;

const tagsToArray = (tagsAsString) => {
  return tagsAsString.split(dbUtils.TAGS_SEPARATOR).slice(0,-1);
}

const tagsToString = (tagsAsArray) => {
  let output = '';
  tagsAsArray.forEach((tag) => {
    output += tag + dbUtils.TAGS_SEPARATOR;
  });
  return output;
}


const initDb = (db) => {
  return db.runAsync(`CREATE TABLE IF NOT EXISTS files (
    fileName        VARCHAR(100)               PRIMARY KEY,
    tags            VARCHAR(2048)              NOT NULL
  )`);
}
