// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAI9ksx6EPMQhULg07gG2KerLT36_NDC2Q",
    authDomain: "test-89d4a.firebaseapp.com",
    databaseURL: "https://test-89d4a.firebaseio.com",
    projectId: "test-89d4a",
    storageBucket: "test-89d4a.appspot.com",
    messagingSenderId: "1075505772606",
    appId: "1:1075505772606:web:c987f0826246c132e0396f",
    measurementId: "G-5PFT1MB1PG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//? sistem login
//* fungsi register
async function registrasi(data) {
    //cek email terdaftar
    let status = true;
    let pesan = "Registrasi berhasil. silahkan login!";
    await firebase.database().ref('/users/').once('value').then((snapshot) => {
        snapshot.forEach((v, i) => {
            if (v.val().email == data.email) {
                pesan = "E-mail telah terdaftar!";
                status = false;
            }
            if (v.val().nik == data.nik) {
                pesan = "NIK telah terdaftar!"
                status = false;
            }
        });
    });
    if (status) {
        firebase.database().ref('users').push().set(data);
    }
    return {
        "status": status,
        "pesan": pesan
    };
}

//* fungsi login-user
async function loginUser(data) {
    let status = false;
    let pesan = "E-mail belum terdaftar!";
    let dataLogin = "";
    let dataIdLogin = "";
    await firebase.database().ref('/users/').once('value').then((snapshot) => {
        snapshot.forEach((v, i) => {
            if (v.val().email == data.email) {
                if (v.val().password == data.password) {
                    status = true;
                    pesan = "login berhasil";
                    dataLogin = v.val();
                    dataIdLogin = v.key;
                    return;
                } else {
                    pesan = "Password salah!"
                    status = false;
                }
            }
        });
    });
    return {
        "status": status,
        "pesan": pesan,
        "data": dataLogin,
        "dataid": dataIdLogin,
    };
}

//* upload gambar
async function uploadFile(file, metadata, folderName) {
    let status = false;
    let pesan = "";
    let url = "";
    let extFile = "." + file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
    // Push to child path.
    await firebase.storage().ref().child(folderName + '/' + Date.now() + extFile).put(file, metadata).then(function (snapshot) {
        pesan = 'Uploaded ' + snapshot.totalBytes + ' bytes.';
        status = true;
        // console.log('File metadata:', snapshot.metadata);
        // Let's get a download URL for the file.
        return url = new Promise((resolve) => {
            snapshot.ref.getDownloadURL().then((dataUrl) => {
                resolve(dataUrl);
            })

        });
    }).catch(function (error) {
        pesan = 'Upload failed: ' + error;
    });

    return {
        "status": status,
        "url": url,
        "pesan": pesan
    };
}
//hapus file yang di upload
function hapusFile(url) {
    firebase.storage().refFromURL(url).delete().then(() => {
        console.log("data di store terhapus");
        // File deleted successfully
    }).catch((error) => {
        console.log("data di store gagal terhapus",error);
        // Uh-oh, an error occurred!
    });
}

// !!!!!!!!!!!!!!!!!!!!!!!!!! //
// TODO:
//* 1. buat form daftar barang -> crud tambah barang untuk di lelang
//tambah data
async function tambahData(namaDB, data) {
    let pesan = "";
    let status = false;
    await firebase.database().ref(namaDB).push().set(data, function (error) {
        if (error) {
            pesan = "Data tidak dapat disimpan." + error;
        } else {
            pesan = "Data berhasil tersimpan.";
            status = true;
        }
    });
    return {
        "status": status,
        "pesan": pesan,
    };
}
//hapus data
async function hapusData(namaDB, id) {
    let pesan = "";
    let status = false;
    await firebase.database().ref(namaDB + "/" + id).remove()
        .then(function () {
            pesan = "Data berhasil dihapus.";
            status = true;
        })
        .catch(function (error) {
            pesan = "Data gagal dihapus." + error;
        });
    return {
        "status": status,
        "pesan": pesan,
    };
}
//select data
async function getData(namaDB, id) {
    let data = "";
    await firebase.database().ref(namaDB + "/" + id).once('value').then((snapshot) => {
        data = snapshot.val();
    });
    return {
        "data": data
    };
}
//update data
async function updateData(namaDB, data, id) {
    let pesan = "";
    await firebase.database().ref(namaDB + "/" + id).update(data, function (error) {
        if (error) {
            pesan = "Data tidak dapat disimpan." + error;
        } else {
            pesan = "Data berhasil tersimpan.";
        }
    });
    return {
        "pesan": pesan
    };
}

//* 2. fitur ikut lelang
//cek lelang aktif dan nonaktif
//if(waktu.server > waktu pada aplikasi) >> ubah status pada record jadi nonaktif else aktif
//api timezone : http://api.timezonedb.com/v2.1/list-time-zone?key=J83H9QQ0IULO&format=json&country=ID&zone=Asia\/Makassar


//* 3. fitur pemenang lelang
//* 4. pembayaran