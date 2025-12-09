const nama ='haikalbanihakim';
let usia = 20;

let biodata = document.getElementById("biodata");

function generateBiodata() {
    let generasi;

    if (usia >= 20 && usia < 30) {
        generasi = 'remaja';
    }
    else if (usia >= 30 && usia < 40) {
        generasi = 'dewasa';
    }
    else if (usia >= 40) {
        generasi = 'tua';
    }
    else if (usia >= 4 && usia < 12)
        generasi = 'dini';
    else {
        generasi = 'balita';
    }
    return biodata.innerHTML = generasi
 
}
console .log(nama);
console .log(usia);

generateBiodata();
