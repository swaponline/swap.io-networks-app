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
  await createIndex('networks_index');
  const bulk = [];
  let itemsProcessed = 0;

  glob('networks/networks/**/info.json', async function (err, files) {
    files.forEach(file => {
      fs.readFile(file, 'utf8',  (err, content) => {
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
          deleteIndex('networks_index');
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
