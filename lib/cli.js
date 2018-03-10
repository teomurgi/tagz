'use strict';

const pkg = require('../package.json');
const commander = require('commander');
const _ = require('lodash');
var Table = require('cli-table2');

const files = require('./files');

const logger = require('./logger');

module.exports = function cli(argv) {

    argv = argv || [];



    var program = new commander.Command();

    program
        .version(pkg.version)
        .usage('<cmd> [opts]');

    program
        .command('list [path]')
        .alias('ls')
        .option('-a, --all', 'Print complete details')
        .description('Lists files in directory')
        .action((path, options) => {
        printFilesList(path, {all: options.all});
});

    program
        .command('add <file> <tag>')
        .alias('a')
        .option('-r, --recursive', 'Apply to all the files of the current directory and of all the subdirectories')
        .description('Adds tag to specified file')
        .action((file, tag, options) => {
        addTagToFile(file, tag, options);
});

    program
        .command('delete <file> <tag>')
        .alias('d')
        .option('-r, --recursive', 'Apply to all the files of the current directory and of all the subdirectories')
        .description('Removes tag to specified file')
        .action((file, tag, options) => {
        deleteTagFromFile(file, tag, options);
});

    program
        .command('*')
        .action(function(){
            program.outputHelp();
        });

    const printFilesList = (path, opts) => {
        const _path = path || '.';
        const all = opts.all || false;

        files.list(_path)
            .then((files) => {
            if (!files)
        throw new Error('Invalid path');
        printStats(files, {complete: all})
    })
    .catch((e) => {
            logger.error(e);
    })
    };

    const addTagToFile = (file, tag, options) => {

        return new Promise((resolve, reject) => {
            if(!options.recursive)
        return resolve(files.addTag(file,tag));
    else
        return resolve(files.recursiveAddTag(file, tag));
    })
    .then((stats) => {

            stats = _.concat([], stats);
        printStats(stats, {complete: false});

    })
    .catch((e) => {
            logger.error(e.message);
    })
    }

    const deleteTagFromFile = (file, tag, options) => {

        return new Promise((resolve, reject) => {
            if(!options.recursive)
        return resolve(files.removeTag(file,tag));
    else
        return resolve(files.recursiveRemoveTag(file, tag));
    })
    .then((stats) => {

            stats = _.concat([], stats);
        printStats(stats, {complete: false});

    })
    .catch((e) => {
            logger.error(e.message);
    })
    }

    const printStats = (stats, options) => {
        const { complete } = options;

        let table;
        if (complete) {
            table = completeTable();
        } else {
            table = compactTable();
        }

        stats.forEach((f, i) => {
            if (complete) {
                const fileProps = [
                    i,
                    f.fileName,
                    f.tags.toString(),
                    f.size,
                    new Date(f.mtimeMs).toISOString(),
                    new Date(f.birthtimeMs).toISOString(),
                    f.absolutePath
                ];
                table.push(fileProps);
            } else {
                const fileProps = [
                    i,
                    f.fileName,
                    f.tags.toString(),
                    new Date(f.mtimeMs).toISOString()
                ];
        table.push(fileProps);
    }
    });
        console.log(table.toString());

    }

    const compactTable = () => {
        return new Table({
            head: ['Idx', 'File Name', 'Tags', 'Last Modified'],
            colWidths: [null, null, null, null]
        });
    }

    const completeTable = () => {
        return new Table({
            head: ['Idx', 'File Name', 'Tags', 'Size (byte)', 'Last Modified', 'Created At', 'Absolute Path'],
            colWidths: [null, null, null, null, null, null, 40]
        });
    }

    program.parse(argv);


}
