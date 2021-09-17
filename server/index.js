const {fetchInfo} = require('./github');
const express = require("express");
const PORT = process.env.PORT || 3001;

const {Client} = require('@elastic/elasticsearch');
const client = new Client({node: `http://localhost:9200`});

const app = express();

fetchInfo();

app.get('/search', function (req, res) {
  const q = req.query['q'] + '*';
  const type = req.query['type'];
  const isToken = type === 'token' ? true : type === 'blockchain' ? false : undefined;

  console.log('q', q);
  const filter = () => {
    if (isToken === undefined) {
      return {
        terms: {
          isToken: [true, false]
        }
      }
    } else {
      return {
        term: {
          isToken: isToken
        }
      }
    }
  };

  const body = {
    size: 500,
    sort: {
      priority: "asc"
    },
    query: {
      bool: {
        must: {
          multi_match: {
            operator: "or",
            fields: [
              "name",
              "logo"
            ],
            query: q,
            type : "phrase_prefix",
          }
        },
        filter: filter(),
      }
    },
  };
  client
    .search({index: 'networks_index', body: body, type: 'networks_list'})
    .then((results) => {
      res.send(results.body.hits.hits);
    })
    .catch((err) => {
      console.log(err);
      res.send([]);
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
