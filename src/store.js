import { readAsArrayBuffer } from 'pouchdb-binary-utils';
import ExifParser from 'exif-parser';

import { sha256 } from './services/crypto';

const PouchDB = require('pouchdb-core')
    .plugin(require('pouchdb-adapter-websql'))
    .plugin(require('pouchdb-adapter-idb'))
    .plugin(require('pouchdb-adapter-http'))
    .plugin(require('pouchdb-replication'));

const DB_NAME = 'gallery-images';
const db = new PouchDB(DB_NAME);
const importingPrefix = 'importing';
const subscribers = [];
let index = null;

self.db = db;

function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function blobToArrayBuffer(blob) {
    return new Promise(resolve => {
        readAsArrayBuffer(blob, resolve);
    });
}

function processImportables() {
    db.allDocs({
        startKey: `${importingPrefix}_A`,
        endKey: `${importingPrefix}_z`,
        include_docs: true,
        attachments: true,
        binary: true,
        // limit: 1,
    }).then(result => {
        return Promise.all(result.rows.map(r => {
            return Promise.all([
                r.doc,
                blobToArrayBuffer(r.doc._attachments.image.data)
            ]).then(([doc, buffer]) => Promise.all([
                doc,
                buffer,
                sha256(buffer),
            ]));
        }));
    }).then(bufferPairs => (
        Promise.all([
            db.bulkDocs(bufferPairs.map(([doc, buffer, digest]) => {
                const exifData = ExifParser.create(buffer).parse();
                const { tags, imageSize } = exifData;
                const originalDate = new Date(
                    tags.DateTimeOriginal
                    ? (new Date(tags.DateTimeOriginal * 1000)).toISOString()
                    : doc.modifiedDate
                );
                const { _id, _rev, ...updoc } = doc;
                const id = `image_${originalDate.getTime().toString(36)}_${digest.substr(0, 6)}`;

                return {
                    ...updoc,
                    ...imageSize, // width & height
                    _id: id,
                    originalDate: originalDate.toISOString(),
                    orientation: tags.Orientation,
                    digest,
                    make: tags.Make,
                    model: tags.Model,
                    flash: !!tags.Flash,
                    ISO: tags.ISO,
                    imageUrl: `/_pouchdb_attachments/${DB_NAME}/${id}/image`,
                    thumbnailURL: null,
                    gps: {
                        latitude: tags.GPSLatitude,
                        longitude: tags.GPSLongitude,
                        altitude: tags.GPSAltitude,
                        heading: tags.GPSImgDirection,
                    }
                };
            })),
            db.bulkDocs(bufferPairs.map(([doc, buffer]) => ({
                _id: doc._id,
                _rev: doc._rev,
                _deleted: true,
            })))
        ])
    )).then(update);
}

export function saveImagesToImport(files) {
    const p = db.bulkDocs(Array.prototype.map.call(files, f => ({
        _id: `${importingPrefix}_${f.name}`,
        name: f.name,
        mimetype: f.type,
        size: f.size,
        modifiedDate: (new Date(f.lastModified)).toISOString(),
        uploadedDate: (new Date()).toISOString(),
        _attachments: {
            image: {
                content_type: f.type,
                data: f,
            }
        }
    })));

    p.then(processImportables);

    return p;
}

export function deleteImages(ids) {
    return db.allDocs({
        keys: Array.from(ids),
    }).then(result => {
        return db.bulkDocs(result.rows.map(doc => ({
            _id: doc.id,
            _rev: doc.value.rev,
            _deleted: true,
        })));
    }).then(update);
}

export function getAlbum(id) {
    return db.allDocs({
        // startKey: 'image_1970-01-01T00:00:00Z',
        // endKey: 'image_9999-01-01T00:00:00Z',
        include_docs: true,
        // attachments: true,
        // binary: true,
        // limit: 1,
    }).then(result => ({
        total: result.total_rows,
        offset: result.offset,
        images: result.rows.map(r => r.doc),
    }));
}

export function getAttachments(ids, attachmentName) {
    // TODO - May be faster to use allDocs. IDK.
    return Promise.all(ids.map(id => db.getAttachment(id, attachmentName)))
    .then(attachments => attachments.map(
        (blob, index) => ({ id: ids[index], attachment: blob }))
    );
}

function update() {
    subscribers.forEach(fn => fn());
}

export function subscribe(fn) {
    subscribers.push(fn);
}
