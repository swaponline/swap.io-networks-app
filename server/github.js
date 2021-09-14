const git = require('simple-git')();
const fs = require('fs');
const glob = require("glob");
const {Client} = require('@elastic/elasticsearch');
const client = new Client({node: `http://localhost:9200`});

const repoURL = 'https://github.com/swaponline/swap.io-networks.git';
const localPath = './networks';
const options = ['--depth', '1'];


const deleteIndex = () => {
    return client.indices.delete({index: 'networks_index'});
};

const handlerFn = () => {
  console.log('DONE');
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
          isToken: parsedContent.logo && parsedContent.logo.includes('tokens')
        };
        bulk.push(modifiedContent);

        if (itemsProcessed === files.length) {
          deleteIndex();
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

const fetchInfo = async () => {
  git.clone(repoURL, localPath, options, handlerFn());
};

if (!client.indices.exists({index: 'networks_index'})) {
  client.indices.create(
    {
      index: 'networks_index',
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

exports.fetchInfo = fetchInfo;
