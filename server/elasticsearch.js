const fs = require('fs');
const glob = require("glob");
const {Client} = require('@elastic/elasticsearch');

const {ELASTICSEARCH_HOST, ELASTICSEARCH_PORT} = require('./constants');
const client = new Client({node: `http://${ELASTICSEARCH_HOST}:${ELASTICSEARCH_PORT}`});

const createIndex = async (indexName) => {
  const isExist = await client.indices.exists({index: indexName});
  console.log('Creating index...', indexName, isExist);
  if (!isExist.body) {
    return client.indices.create({index: indexName});
  }
};

const indexingData = async () => {
  const isElasticReady = await checkConnection();
  if (isElasticReady) {
    await indexing();
  }
};

const indexing = async () => {
  try {
    await client.indices.delete({
      index: '_all'
    });
  } catch (err) {
    console.error('ERROR deleting', err.message);
  }

  try {
    await createIndex('assets_index');
  } catch (err) {
    console.log('Catching error create index', err);
  }
  try {
    await createIndex('networks_index');
  } catch (err) {
    console.log('Catching error create index', err);
  }


  const bulk = [];
  let itemsProcessed = 0;
  const path = './networks/dist/mainnet/assets-groups.json';
  const mockPath = './mockAssets.json';
  let data = null;
  if (fs.existsSync(path)) {
    console.log('Assets exists');
    data = fs.readFileSync(path, 'utf8');
  } else if (fs.existsSync(mockPath)) {
    console.log('Mocks exists');
    data = fs.readFileSync(mockPath, 'utf8');
  } else {
    console.log("DOES NOT exist:", path);
  }
  const indexing = [];
  let items = 0;
  const parsedContent = JSON.parse(data);
  parsedContent.map(asset => {
    items++;
    indexing.push({
      index: {
        _index: 'assets_index',
        _type: 'assets_list',
      },
    });
    indexing.push(asset);
    if (items === parsedContent.length) {
      client.bulk({body: indexing}, function (err, response) {
        if (err) {
          console.log('Failed bulk operation.', err);
        } else {
          console.log('Successfully', parsedContent.length);
        }
      });
    }
  });

  // glob('networks/networks/**/info.json', async function (err, files) {
  //   files.forEach(file => {
  //     fs.readFile(file, 'utf8', (err, content) => {
  //       itemsProcessed++;
  //       const parsedContent = JSON.parse(content);
  //       bulk.push({
  //         index: {
  //           _index: 'networks_index',
  //           _type: 'networks_list',
  //         },
  //       });
  //       const modifiedContent = {
  //         ...parsedContent,
  //         isToken: parsedContent.logo ? parsedContent.logo.includes('tokens') : false
  //       };
  //       bulk.push(modifiedContent);
  //
  //       if (itemsProcessed === files.length) {
  //         client.bulk({body: bulk}, function (err, response) {
  //           if (err) {
  //             console.log('Failed bulk operation.', err);
  //           } else {
  //             console.log('Successfully imported %s', files.length);
  //           }
  //         });
  //       }
  //     });
  //     if (err) return console.log(err);
  //   })
  // });
};

const checkConnection = () => {
  return new Promise(async (resolve) => {
    console.log("Checking connection to ElasticSearch...");

    let isConnected = false;

    while (!isConnected) {

      try {
        await client.cluster.health({});
        console.log("Successfully connected to ElasticSearch");
        isConnected = true;
      } catch (_) {}
    }

    resolve(true);

  });
}

exports.indexingData = indexingData;
exports.checkConnection = checkConnection;
