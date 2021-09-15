const git = require('simple-git')();
const {indexingData} = require('./elasticsearch');

const repoURL = 'https://github.com/swaponline/swap.io-networks.git';
const localPath = './networks';
const options = ['--depth', '1'];

const fetchInfo = async () => {
  git.clone(repoURL, localPath, options, indexingData());
};

exports.fetchInfo = fetchInfo;
