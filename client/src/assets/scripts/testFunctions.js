import CryptoInterface from '../../swap.io-keys/src/crypto/interface';

export const createAddress = (network, mnemonic, addressTemplate, originalNumber, purpose, chainId, account) => {
  const cInterface = new CryptoInterface();
  window.cInterface = cInterface;
  const testMnemonic = "talk crisp crane dose network winner lumber harvest actual brand loud patch achieve army turtle warm section grab wish traffic anger steak rate square"
  console.log('Create address', testMnemonic);
  return cInterface
    .createProfileFromMnemonic(
      mnemonic.split(` `), // mnemonic (array)
      `` // password - use empty
    )
    .then( async (testProfile) => {
      console.log('>>> testProfile', testProfile);
      // get network adaptor
      return await cInterface
        .getNetworkAdaptor(network)
        .then( async (bitcoinNetworkAdaptor) => {
          // create address
          const addressInfo = await testProfile.createAddress(
            bitcoinNetworkAdaptor,
            originalNumber, // address index -0,1,2 etc
            // params
            {
              template: addressTemplate, // bip44, other - address type
              templateSetting: {
                purpose, chainId, account
              } // template settings
            }
          )
          console.log('>>> addressInfo', addressInfo);
          return addressInfo;
        })
        .catch(err => {
          console.log('---Error', err);
          return err;
        })
    })
};
