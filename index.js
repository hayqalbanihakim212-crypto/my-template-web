//  const namaSaya = "qal"; function getName() {for (let i = 0; i < 10; i++){console.log (namaSaya);}};getName();
const http = require('http');
const rupiah = require('to-rupiah')
const fs = require('fs');
const os = require('os');
const cpus = os.cpus();
const host = '127.0.0.1'
const port = 3001
// resquest itu perintah dari luar, respon itu dari dalam
const server = http.createServer(function (request, reponse) {
    const nama = "qali";
    let uang = 150000;
    let jajan = 100000;
    let sisa = uang - jajan;

    uang = rupiah.toRupiah(uang);
    jajan = rupiah.toRupiah(jajan);
    sisa = rupiah.toRupiah(sisa);
    fs.appendFile('log.txt', sisa, () => {
        console.log('data simpanan')
    });
    const sisaRam = os.freemem();
    const namaCPU = cpus[0].model;
    const hasil =
        `nama saya ${nama}, 
    jajan saya ${jajan}, 
    uang saya ${uang} 
    dan sisa ${sisa}, sisa ram ${sisaRam}, 
    CPU saya ${namaCPU}`;



    reponse.statusCode = 203;
    reponse.end(hasil);
});
server.listen(port, host, '', function () {
    console.log(`actif to ${host}:${port}`)
});
