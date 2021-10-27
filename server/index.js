const {indexingData} = require('./elasticsearch');
const express = require("express");
const cors = require('cors');

const {PORT, ELASTICSEARCH_HOST, ELASTICSEARCH_PORT} = require('./constants');

const {Client} = require('@elastic/elasticsearch');
const client = new Client({node: `http://${ELASTICSEARCH_HOST}:${ELASTICSEARCH_PORT}`});

const app = express();
app.use(cors());

indexingData()

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
              "symbol",
              "address"
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

app.get('/popular-assets', function (req, res) {
  const { from, size } = req.query
  const body = {
    from: from || 0,
    size: size || 500,
    sort: {
      priority: "asc"
    },
  };
  client
    .search({index: 'assets_index', body: body, type: 'assets_list'})
    .then((results) => {
      res.send(results.body.hits.hits);
    })
    .catch((err) => {
      console.log(err);
      res.send([]);
    });
});

app.get('/search/assets', function (req, res) {
  const q = req.query['q'] + '*';
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
              "symbol",
              "address"
            ],
            query: q,
            type : "phrase_prefix",
          }
        }
      }
    },
  };
  client
    .search({index: 'assets_index', body: body, type: 'assets_list'})
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
