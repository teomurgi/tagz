'use strict';

const Promise = require('./promise');
const _ = require('lodash');
const Path = require('path');
const logger = require('./logger');

const fs = Promise.promisifyAll(require('fs'));

const tags = require('./tags');

const list = (path) => {
  return fs.readdirAsync(path)
    .then((files) => {
    return Promise.reduce(files, (output, file) => {
      if(file==='__tagz' || file.startsWith('.')) return output;
      const absolutePath = Path.resolve(path);
      return fs.statAsync(Path.join(absolutePath, file))
        .then((stats) => {
          if(!stats.isDirectory()) {
            let myStats = _.pick(stats, 'size', 'birthtimeMs', 'mtimeMs');
            myStats.fileName = file;
            myStats.absolutePath = absolutePath;
            return tags.getTags(absolutePath, file)
              .then((tags) => {
                myStats.tags = tags || [];
                output.push(myStats);
                return output;
              });
          }
          return output;
        });
      }, []);
    })
    .catch((e) => {
      logger.error(e);
    })
}

module.exports.list = list;


const addTag = (path, tag) => {
  const fileName = Path.basename(path);
  if(fileName.startsWith('.'))
    throw new Error('Cannot add tag to hidden file');
  const absolutePath = Path.resolve(Path.dirname(path));
  return fs.statAsync(path)
    .then((stats) => {
      if(stats.isDirectory())
        throw new Error('Cannot add tag to directory');
      return [stats, tags.addTagToFile(Path.normalize(Path.dirname(path)), Path.basename(path), tag)];
    })
    .spread((stats, tags) => {
      let myStats = _.pick(stats, 'size', 'birthtimeMs', 'mtimeMs');
      myStats.fileName = fileName;
      myStats.absolutePath = absolutePath;
      myStats.tags = tags || [];
      return myStats;
    })
}

module.exports.addTag = addTag;

// const recursiveAddTag = (path, tag, directories, files) => {
//   directories = directories || [];
//   files = files || [];
//   return fs.statAsync(path)
//     .then((stats) => {
//       if(!stats.isDirectory())
//         throw new Error('Path must be a directory');
//       return fs.readdirAsync(path);
//     })
//     .then((newFiles) => {
//       newFiles.forEach((f) => {
//         const fileWithPath = Path.join(path, f);
//         if(fs.statSync(fileWithPath).isDirectory()) {
//           directories.push(fileWithPath);
//         } else {
//           files.push(fileWithPath);
//         }
//       });
//       if(directories.length > 0)
//         return recursiveAddTag(directories.pop(), tag, directories, files);
//       else
//         return files;
//     }).then((files) => {
//       console.log(files);
//     })
// }

const recursiveAddTag = (path, tag) => {
  const files = recursiveFileList(path)
  return Promise.reduce(files, (output, file) => {
    return addTag(file,  tag)
      .then((stats) => {
        output.push(stats);
        return output;
      })
  }, [])
    .then((stats) => {
      return stats;
    });
}

module.exports.recursiveAddTag = recursiveAddTag;

const recursiveFileList = (path, directories, files) => {
  directories = directories || [];
  files = files || [];

  if(!fs.statSync(path).isDirectory())
    throw new Error('Path must be a directory');

  const newFiles = fs.readdirSync(path);
  newFiles.forEach((f) => {
    const fileWithPath = Path.join(path, f);
    if(fs.statSync(fileWithPath).isDirectory()) {
      directories.push(fileWithPath);
    } else {
      if(f !== '__tagz' && !f.startsWith('.'))
        files.push(fileWithPath);
    }
  });

  if(directories.length > 0)
    return recursiveFileList(directories.pop(), directories, files);
  else
    return files;
}



const removeTag = (path, tag) => {
  const fileName = Path.basename(path);
  if(fileName.startsWith('.'))
    throw new Error('Cannot remove tag from hidden file');
  const absolutePath = Path.resolve(Path.dirname(path));
  return fs.statAsync(path)
    .then((stats) => {
      if(stats.isDirectory())
        throw new Error('Cannot remove tag from directory');
      return [stats, tags.removeTagFromFile(Path.normalize(Path.dirname(path)), Path.basename(path), tag)];
    })
    .spread((stats, tags) => {
      let myStats = _.pick(stats, 'size', 'birthtimeMs', 'mtimeMs');
      myStats.fileName = fileName;
      myStats.absolutePath = absolutePath;
      myStats.tags = tags || [];
      return myStats;
    })
}

module.exports.removeTag = removeTag;

const recursiveRemoveTag = (path, tag) => {
  const files = recursiveFileList(path)
  return Promise.reduce(files, (output, file) => {
    return removeTag(file, tag)
      .then((stats) => {
        output.push(stats);
        return output;
      })
  }, [])
    .then((stats) => {
      return stats;
    });
}

module.exports.recursiveRemoveTag = recursiveRemoveTag;