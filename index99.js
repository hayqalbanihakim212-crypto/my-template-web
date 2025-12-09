let USNML = document.getElementById("USNML")
let USNM = document.getElementById("USNM")
let PWSL = document.getElementById("PWSL")
let PWS = document.getElementById("PWS")
let SVSnmpws = document.getElementById("SVSnmpws")

const generateUsernamePassword = (len) => {
    const lowerAlphabet = "abcdefghijklmnopqrstuvwxyz"
    const upperAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numeric = "0123456789"
    const symbol = "!@#$%^&*()_+=-{}[]';:/?.,<>~`"

    const data = lowerAlphabet + upperAlphabet + numeric + symbol
    let generator = '';
    for (let index99 = 0; index99 < len; index99++) {
        generator += data[~~(Math.random() * data.length)];
    }
    return generator
}

const getUsernamePassword = () => { 
   USNM.value = generateUsernamePassword(USNML.value)
   PWS.value = generateUsernamePassword(PWSL.value)
    alert('username and password has been generated!')
}

const saveUsernamePassword = () => {
document.title = USNM.value + " & " + PWS.value
SVusnmpws.setAttribute ('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent
    (`Username: ${USNM.value} \nPassword: ${PWS.value}`))
SVusnmpws.setAttribute('download', 'MyUsernamePasswordLog.txt')
setTimeout(() => {
    alert ('succes')
},)
}


//   <label>Masukkan Pesan Asli:</label>
//     <input type="text" id="inputAsli" placeholder="Ketik di sini...">
    
//     <button onclick="terjemahkanKode()">ENKRIPSI SEKARANG</button>
    
//     <br><br>
    
//     <label>Hasil Sandi:</label>
//     <textarea id="hasilOutput" rows="4" readonly></textarea>
// <script>
//         const kamusRahasia = {
//             'a': '@', 'b': '8', 'e': '3', 
//             'g': '9', 'i': '1', 'o': '0', 
//             's': '$', 't': '7', 'y': '6',
//             'z': '2' 
//         };

//         function terjemahkanKode() {
//             let teks = document.getElementById("inputAsli").value.toLowerCase();
//             let hasil = "";

//             for (let i = 0; i < teks.length; i++) {
//                 let huruf = teks[i];
//   if (kamusRahasia[huruf]) {
//                     hasil += kamusRahasia[huruf]; 
//                 } else {
//                     hasil += huruf; 
//                 }
//             }

//             document.getElementById("hasilOutput").value = hasil;
//         }
//     </script>





