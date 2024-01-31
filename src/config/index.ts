export default {
    port: process.env.PORT || 9000,
    renap: {
        url: "https://newdev.genesisempresarial.org/wsrenap/api/informacion",
        secretKey: process.env.RENAP_SECRET_KEY || '',
        appBundle: 'FUNTEC'
    }
}