import CryptoInterface from '../../swap.io-keys/src/crypto/interface';

export const createAddress = (mnemonic, addressTemplate, originalNumber, purpose, chainId) => {
  const cInterface = new CryptoInterface();
  window.cInterface = cInterface;
  const testMnemonic = "talk crisp crane dose network winner lumber harvest actual brand loud patch achieve army turtle warm section grab wish traffic anger steak rate square"
  console.log('Create address', testMnemonic);
  cInterface
    .createProfileFromMnemonic(
      testMnemonic.split(` `), // mnemonic (array)
      `` // password - use empty
    )
    .then((testProfile) => {
      console.log('>>> testProfile', testProfile)
      // get network adaptor
      cInterface
        .getNetworkAdaptor('bitcoin')
        .then((bitcoinNetworkAdaptor) => {
          // create address
          const addressInfo = testProfile.createAddress(
            bitcoinNetworkAdaptor,
            0, // address index -0,1,2 etc
            // params
            {
              template: 'default', // bip44, other - address type
              templateSetting: {} // template settings
            }
          )
          console.log('>>> addressInfo', addressInfo)
        })
    })
};
