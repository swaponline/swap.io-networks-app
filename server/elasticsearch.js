const fs = require('fs');
const glob = require("glob");
const {Client} = require('@elastic/elasticsearch');
const client = new Client({node: `http://localhost:9200`});


const deleteIndex = (indexName) => {
  return client.indices.delete({index: indexName});
};

const createIndex = (indexName) => {
  if (!client.indices.exists({index: indexName})) {
    client.indices.create(
      {
        index: indexName,
      },
      function (error, response, status) {
        if (error) {
          console.log(error);
        } else {
          console.log('Created a new index.', response);
        }
      }
    );
  }
};

const indexingData = async () => {
  await deleteIndex('assets_index');
  await deleteIndex('networks_index');
  await createIndex('networks_index');
  await createIndex('assets_index');
  const bulk = [];
  let itemsProcessed = 0;

  const assetsGroup = fs.readFileSync('networks/dist/mainnet/assets-groups.json', 'utf8');
  const mockData = fs.readFileSync('server/mockAssets.json', 'utf8');
  const data = assetsGroup ? assetsGroup : mockData;
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

  glob('networks/networks/**/info.json', async function (err, files) {
    files.forEach(file => {
      fs.readFile(file, 'utf8', (err, content) => {
        itemsProcessed++;
        const parsedContent = JSON.parse(content);
        bulk.push({
          index: {
            _index: 'networks_index',
            _type: 'networks_list',
          },
        });
        const modifiedContent = {
          ...parsedContent,
          isToken: parsedContent.logo ? parsedContent.logo.includes('tokens') : false
        };
        bulk.push(modifiedContent);

        if (itemsProcessed === files.length) {
          client.bulk({body: bulk}, function (err, response) {
            if (err) {
              console.log('Failed bulk operation.', err);
            } else {
              console.log('Successfully imported %s', files.length);
            }
          });
        }
      });
      if (err) return console.log(err);
    })
  });
};

exports.indexingData = indexingData;
