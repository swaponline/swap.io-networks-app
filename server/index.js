const {fetchInfo} = require('./github');
const express = require("express");
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: `http://localhost:9200` });

const PORT = process.env.PORT || 3001;

const app = express();

fetchInfo();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});
app.get('/search', function (req, res) {
  // Declare the query object to search Elasticsearch.
  // Return only 200 results from the first result found.
  // Also match any data where the name is like the query string sent in.
  let body = {
    size: 200,
    from: 0,
    query: {
      match: {
        name: req.query['q'],
      },
    },
  };
  console.log('body', body);
  // Perform the actual search passing in the index, the search query, and the type.
  client
    .search({ index: 'networks_index', body: body, type: 'networks_list' })
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
