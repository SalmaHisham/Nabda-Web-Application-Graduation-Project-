/*********************************************************** constants  **************************************************************************/
var firebaseConfig = {
apiKey: "AIzaSyAjI9w1Nyj6QCFhmTOdSYN8SitzTb96pJ0",
authDomain: "nabdawebapp.firebaseapp.com",
databaseURL: "https://nabdawebapp-default-rtdb.firebaseio.com",
projectId: "nabdawebapp",
storageBucket: "nabdawebapp.appspot.com",
messagingSenderId: "583448274380",
appId: "1:583448274380:web:9a9a75834b599ab2bd6969"
};
firebase.initializeApp(firebaseConfig);
const patientId = localStorage.getItem("patientId");
const loginMail = localStorage.getItem("email");
/****************************** DoctorDiagnosis DataTables  ***************************************/
const doctorDiagnosisTable = $('#doctorDiagnosisTable').DataTable({
    "drawCallback": function( settings ) {
        $("#doctorDiagnosisTable thead").remove();
    },
    ordering:false,
    order: [[ 0, "desc" ]],
    "sDom": '<"clear">'
    });
/****************************** MRITable DataTables  *********************************************/
const MRITable = $('#MRITable').DataTable({
    "drawCallback": function( settings ) {
        $("#MRITable thead").remove();
    },
    ordering:false,
    order: [[ 0, "desc" ]],
    "sDom": '<"clear">'
    });
/************************************* MedicalTest DataTables  ************************************/
const medicalTestTable = $('#medicalTestTable').DataTable({
    "drawCallback": function( settings ) {
        $("#medicalTestTable thead").remove();
    },
    ordering:false,
    order: [[ 0, "desc" ]],
    "sDom": '<"clear">'
});

/**************************************************************** onLoad  **********************************************************************/
window.addEventListener("load", ()=>{

    const patientName = document.getElementById("patientName");
    const patientAge = document.getElementById("patientAge");
    const patientHeight = document.getElementById("patientHeight");
    const patientWeight = document.getElementById("patientWeight");
    const patientBloodType = document.getElementById("patientBloodType");
    const patientImg = document.getElementById("patientImg");
    const patientId = localStorage.getItem("patientId");
    const loginMail = localStorage.getItem("email");
    //manage privilages (old fashion way :DD)
    firebase.firestore().collection('accounts').doc(loginMail).onSnapshot((doc) => {
        if(doc.data().role =="testSpecialist"){
            document.getElementById("addCTScan").classList.remove("hidden");
            document.getElementById("addmedicalTest").classList.remove("hidden"); 
        }
        if(doc.data().role =="Cardiologist"){
            document.getElementById("doctorDiagnosisSection").classList.remove("hidden");
            document.getElementById("medicineSection").classList.remove("hidden");
            document.getElementById("sectionThree").classList.remove("hidden");

        }
    });
    /**************************************************** get Basic Data  *****************************************************/
    firebase.firestore().collection(`accounts/${loginMail}/users`).doc(patientId).get()
    .then( doc => {
          if (doc.exists){
              console.log("doc exists");
              patientName.innerHTML = doc.data().fullName ;   
              patientAge.innerHTML = doc.data().Age + " years" ;   
              patientHeight.innerHTML = doc.data().Hight + " cm" ;   
              patientWeight.innerHTML = doc.data().Weight + " kg";   
              patientBloodType.innerHTML = doc.data().BloodType ;  
              // retrieve patientImg 
                if(doc.data().profileImage){
                  patientImg.src = doc.data().profileImage;
                }
             }
             else {
                console.log("doc not exists");
            }
    })
    .catch(err => {
            console.log("error",err);
    });
    /*************************************************** get Medicine  ********************************************************/
    firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/medicineAdded/medicines`).get()
    .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists){
                    let json = doc.data();
                    let medicineName = json["medicineName"];
                    let duration = json["duration"];
                    let imgType = json["imageType"];
                    addNewRow(medicineName,duration);
                }
                else {
                    console.log("doc not exists");
                }
            });
    }).catch((error) => {
    console.error(error);
    });
    function addNewRow(medicineName,duration) {
            var MedicineTable = document.getElementById("MedicineTable");
            var row = MedicineTable.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = medicineName;
            cell2.innerHTML = duration;

    }
    /****************************************************** get Notes  ********************************************************/
    firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/notesWritten/notes`).get()
    .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists){
                    let json = doc.data();
                    let noteBody = json["noteBody"];
                    addNewLi(noteBody);
                }
                else {
                    console.log("doc not exists");
                }
            });
    }).catch((error) => {
    console.error(error);
    });
    function addNewLi(newNote) {
            var ul = document.getElementById("list");
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(newNote));
            ul.appendChild(li);
    }
    /****************************************************** get Nutrition  ****************************************************/
    firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/dataInNutritionCell/nutritions`).get()
    .then((querySnapshot) => {
            var i = 0;
            querySnapshot.forEach((doc) => {
                if (doc.exists & i < 2 ){
                    i++;
                    let json = doc.data();
                    let nutrition = json["nutritionDataItself"];
                    if(i ==1){
                        for(var j=0; j<nutrition.length; j++){
                            if (j<2){
                                addNewNutritionLi(nutrition[j]);
                            }
                            else{
                                addNewNutrition2Li(nutrition[j]);
                            }
                        }
                    }
                    if(i ==2){
                        for(var j=0; j<nutrition.length; j++){
                            if (j<2){
                                addNewNutrition3Li(nutrition[j]);
                            }
                            else{
                                addNewNutrition4Li(nutrition[j]);
                            }
                        }
                    }
                }
                else {
                    console.log("doc not exists");
                }
            });
    }).catch((error) => {
    console.error(error);
    });
    function addNewNutritionLi(newNutrition) {
            var ul = document.getElementById("nutrition1");
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(newNutrition));
            ul.appendChild(li);
    }
    function addNewNutrition2Li(newNutrition) {
            var ul = document.getElementById("nutrition2");
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(newNutrition));
            ul.appendChild(li);

    }
    function addNewNutrition3Li(newNutrition) {
            var ul = document.getElementById("nutrition3");
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(newNutrition));
            ul.appendChild(li);
    }
    function addNewNutrition4Li(newNutrition) {
            var ul = document.getElementById("nutrition4");
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(newNutrition));
            ul.appendChild(li);

    }
    /******************************************************** get Diagnosis  ***************************************************/
    firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/doctorDiagnosis/diagnosis`).get()
    .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists){
                    let json = doc.data();
                    BuilrNewDiagnosisRow(json);
                }
                else {
                    console.log("doc not exists");
                }
            });
    })
    .catch((error) => {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'some thing went wrong while getting the Diagnosis!',
                showConfirmButton: false,
                timer: 1000
            })
    });  
    /******************************************************** get MRIs   *******************************************************/
    firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/MRIs/MRI`).get()
    .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists){
                    let json = doc.data();
                    let inImgName = json["inImgName"];
                    let outImgName = json["outImgName"];
                    let date = json["date"];
                    drawMRIRow(inImgName,outImgName, date);
                }
                else {
                    console.log("doc not exists");
                }
            });
    })
    .catch((error) => {
            console.error(error);
    });
    /*************************************************** get MedicalTests   ****************************************************/
    firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/MedicalTests/Test`).get()
    .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists){
                    let json = doc.data();
                    let URLofPdf = json["URLofPdf"];
                    let URLName = json["URLName"];
                    let date = json["date"];
                    buildMedicalTestrow(URLofPdf, URLName, date);
                }
                else {
                    console.log("doc not exists");
                }
            });
    })
    .catch((error) => {
            console.error(error);
    });
    /********************************************************* on click DataTables  ********************************************/
    // medical Test Table
    $('#medicalTestTable tbody').on('click', 'tr', handleRowClick);
    function handleRowClick(event){
            const tr = event.currentTarget ;
            const imgsrc = tr.querySelector('h6').id;
            const innerModal = document.querySelector("#MedicalTestModal .modal-body");
            innerModal.innerHTML = `
            <div class="container-fluid">
            <img src=${imgsrc} alt="test-result" >
            <div class="modal-footer pr-4">
                <button type="button" class="btn btn-secondary text-center" data-dismiss="modal">Close</button>
            </div>
            </div>
            `
            console.log("clicked");
    }
    //MRI Table 
    $('#MRITable tbody').on('click', 'tr', handleMRIRowClick);
    function handleMRIRowClick(event){
            const tr = event.currentTarget ;
            console.log(tr);
            const imgsrc = tr.querySelector('h6').id;
            const inImgSrc = "/img/Out_img/Original/" + imgsrc.split('/')[0];
            const outImgSrc = "/img/Out_img/"+ imgsrc.split('/')[1];
            const innerModal = document.querySelector("#MRIModal .modal-body");
            innerModal.innerHTML = `
            <div class="row container-fluid text-uppercase font-weight-bold text-secondary ">
            <div class="col">
                <h5 > Result </h5>
                <img src="${inImgSrc}" class="m-4 w-75 rounded h-75 " >
            </div>
            <div class="col">
                <h5 > Take care of </h5>
                <img src="${outImgSrc}" class="mt-3 w-100 rounded h-75 border-left border-secondary" >
            </div>
            </div>
            `
            console.log("clicked");
    }
    //Diagnosis Table
    $('#doctorDiagnosisTable tbody').on('click', 'tr', handleDiagnoseRowClick);
    function handleDiagnoseRowClick(event){
        const tr = event.currentTarget ;
        const btn = tr.querySelector('div');
        const data = btn.getAttribute("data-set").split("+");
        document.querySelector(".modal-body #DrName").innerHTML = data[0];
        document.querySelector(".modal-body #diagnoseDate").innerHTML = data[1];
        document.querySelector(".modal-body #currentSymptoms").innerHTML = data[2];
        document.querySelector(".modal-body #currentDiagnosis").innerHTML = data[3];
        console.log("clicked");
    }

});// end of event listener -------------------------------------------------------------------------------------------------------------------->




/********************************************************* Form Modal validation  ***********************************************************/
(function () {
    'use strict'
    const patientId = localStorage.getItem("patientId");
    const loginMail = localStorage.getItem("email");
    var forms = document.querySelectorAll('.medicine-validation')
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            
            event.preventDefault();
            if (!form.checkValidity()) {
                event.stopPropagation();
                console.log("not valid");
                
            }
            else {
                console.log("valid");
                const medicineName = event.target.medicineName.value;
                const medicineDuration = event.target.medicineDuration.value;
                const medicineFrequency = event.target.medicineFrequency.value;
                const medicineType = document.querySelector('input[name="MedicineType"]:checked').value;
                
                addNewMedicine(medicineName,medicineDuration,medicineFrequency,medicineType,patientId,loginMail);
                $(".modal-backdrop").remove();
                $('#MedicineModal').modal('hide');
            }
        form.classList.add('was-validated')

    }, false)
})
var formm = document.querySelector('.needs-validation')
	// Loop over them and prevent submission
		formm.addEventListener('submit', function (event) {
			event.preventDefault()
			if (!formm.checkValidity()) {
                event.stopPropagation()
                console.log("not valid");
			}
            else {
                console.log("valid");
                const newSymptoms = event.target.newSymptoms.value;
                const newDiagnosis = event.target.newDiagnosis.value;
                addNewDiagnosis(newSymptoms,newDiagnosis,patientId,loginMail);
                $(".modal-backdrop").remove();
                $('#diagnosisModal').modal('hide');
            }
			formm.classList.add('was-validated')

		}, false)

})()
/*********************************************************** Set New Diagnosis   **************************************************************/
function addNewDiagnosis(newSymptoms,newDiagnosis,patientId,loginMail){
    //get date
    var today = new Date();
    var date = today.getFullYear()+' / '+(today.getMonth()+1)+' / '+today.getDate();
    //get doctor's name
    const DoctorName = localStorage.getItem("name");
    var data = {"newSymptoms":newSymptoms,"newDiagnosis":newDiagnosis,"date":date,"DoctorName":DoctorName};
    firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/doctorDiagnosis/diagnosis`).add(data)
    .then(() => {
        console.log("Diagnosis inserted successfully !");
        BuilrNewDiagnosisRow(data);
        Swal.fire({
            position: 'top-middle',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          })
    })   
    .catch((error) => {
        console.error("Error writing document: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'some thing went wrong !',
            showConfirmButton: false,
            timer: 1000
        })
    });
}
function BuilrNewDiagnosisRow(data){
    const DoctorName = data.DoctorName;
    const date = data.date;
    const dataid = `${DoctorName}+${date}+${data.newSymptoms}+${data.newDiagnosis}`
    var dataSet = [`<img src="/img/viewPatient/doctor.jpg" id="doctorImg" class="rounded-circle  img-fluid" alt="doctor" >`,
    `
    <div data-toggle="modal"  data-target="#viewDiagnosis"  data-set="${dataid}">
    <h6 class="doctorName"> ${DoctorName} </h6>
    <h6 class="diagnoseDate"> ${date} </h6>
    </div>`
    ];
    doctorDiagnosisTable.row.add(dataSet).draw();
}
/*********************************************************** Set New Medicine  ***************************************************************/
function addNewMedicine(medicineName,medicineDuration,medicineFrequency,medicineType,patientId,loginMail){
    var date = new Date().getTime() /1000;
    
    var data = {"medicineName":medicineName,"duration":medicineDuration,"imageType":medicineType,"medicineFrequency":medicineFrequency,"timeOfAddMedicine":date};
    firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/medicineAdded/medicines`).add(data)
    .then(() => {
        console.log("Medicine inserted successfully !");
        Swal.fire({
            position: 'top-middle',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          })        
    })   
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}
/*********************************************************** Set MRI Segmentation *************************************************************/
// (for only uploading one file at a time)
$('#file-upload').change(function(e){
    files = e.target.files;
    const formData = new FormData();
    formData.append('uploads', files[0], files[0].name);
    var csrf=$("#csrf").val();
    if (files.length != 0) {
    $.ajaxSetup({
        headers: {
        'X-CSRF-Token': csrf
        }
    });
    $.ajax({
        type: 'POST',
        url: 'http://localhost:5000/patientList/patient/ctScan/MRI-result',
        data:formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response) { 
            console.log("here we go")
            //get current data
            var today = new Date();
            var date = today.getDate()+' / '+(today.getMonth()+1)+' / '+today.getFullYear();  
            //get input n output img
            console.log(response) 
            var imgs = response[0].split('/');
            var outImgName = "Seg"+imgs[0];
            var inImgName = imgs[1];

            Swal.fire({
                position: 'top-middle',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            })
            //build new row 
            drawMRIRow(inImgName,outImgName, date);
            //upload url path to firestore
            firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/MRIs/MRI`).add({
                "inImgName" : inImgName,
                "outImgName" : outImgName,
                "date" : date
            })
            // static mail just for testing ->
            firebase.firestore().collection(`accounts/marwan@gmail.com/users/${patientId}/patientData/MRIs/MRI`).add({
                "inImgName" : inImgName,
                "outImgName" : outImgName,
                "date" : date
            })
        }, // end of success 
        error: function(xhr, status, err) {
        // console.log(xhr.responseText);
        // failed msg 
        Swal.fire({
            position: 'top-middle',
            icon: 'error',
            title:"Oops",
            text:"something went wrong",
            showConfirmButton: false,
            timer: 1500
        })
        }
    });
    }
    else {
        alert("No file chosen");
        Swal.fire({
            position: 'top-middle',
            icon: 'error',
            test:"No file chosen",
            showConfirmButton: false,
            timer: 1500
        })
    }  
});
function drawMRIRow(inImgName,outImgName, date){ 
    const id = inImgName+'/'+outImgName;
    var dataSet = [
    `<img src="/img/viewPatient/document.svg" class="rounded img-fluid" data-toggle="modal"data-target="#MRIModal">`,
    `<div  class="text-left py-1" data-toggle="modal"data-target="#MRIModal">
        <h6 class="testName" id=${id}> ${inImgName}</h6>
        <h6 class="testDate">${date}</h6>
    </div>`
    ];
    MRITable.row.add(dataSet).draw();
}
/********************************************************** Set MedicalTest *******************************************************************/
$('#test-upload').change(function(e){
    files = e.target.files;
    if (files.length != 0) {
        const task = firebase.storage().ref(`MedicalTests/${files[0].name}`).put(files[0]);
        //build new row
        const testName = files[0] ;
        //upload url path to firestore
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          var today = new Date();
          var date = today.getDate()+' / '+(today.getMonth()+1)+' / '+today.getFullYear();     
          Swal.fire({
            position: 'top-middle',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
        })
          //draw new row 
          buildMedicalTestrow(url,testName.name,date);
          firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/MedicalTests/Test`).add({
            "URLName" : testName.name,
            "URLofPdf" : url,
            "date":date
          })
          // need to change doctor's mail 
          firebase.firestore().collection(`accounts/marwan@gmail.com/users/${patientId}/patientData/MedicalTests/Test`).add({
            "URLName" : testName.name,
            "URLofPdf" : url,
            "date":date
        })
        })
    }
    else {
        alert("No file chosen");
        Swal.fire({
            position: 'top-middle',
            icon: 'error',
            test:"No file chosen",
            showConfirmButton: false,
            timer: 1500
        })
    }  

      
});
function buildMedicalTestrow(testUrl, testName, date) {   
    let dataSet = [
    `<img src="/img/viewPatient/document.svg" class="rounded img-fluid" data-toggle="modal"data-target="#MedicalTestModal">`,
    `<div  class="text-left py-1" data-toggle="modal"data-target="#MedicalTestModal">
        <h6 class="testName" id=${testUrl}> ${testName}</h6>
        <h6 class="testDate">${date}</h6>
    </div>
    `];
    medicalTestTable.row.add(dataSet).draw();
}
/************************************************************ ECG result *********************************************************************/
function getData(){
    var signal =[ -0.1482724904, -0.1429542989, -0.1094347265, -0.031710241, 0.1552077223, 0.4640826536, 0.7462404569, 0.805303075, 0.6402389633, 0.4349066507, 0.308522, 0.247720531, 0.2192652321, 0.1715602318, 0.1081294125, 0.0571684694, -0.0217029438, -0.1048965458, -0.1834787571, -0.292771088, -0.4188482468, -0.565715272, -0.7143485173, -0.8731538974, -1.0590397342, -1.2129993481, -1.3315382217, -1.4407741904, -1.5443064997, -1.6529345069, -1.7772121752, -1.93470616, -2.1098948283, -2.2834750762, -2.4399540764, -2.5633186291, -2.6801748419, -2.7882536493, -2.8774064812, -2.9641315132, -3.033529033, -3.0827441362, -3.1175618928, -3.150782393, -3.1912066427, -3.2081700577, -3.2234771885, -3.2400976815, -3.2240134716, -3.2216502059, -3.2396973962, -3.2455277092, -3.2375426918, -3.211412718, -3.1796141399, -3.1282961698, -3.0480140208, -2.9565200439, -2.8598221071, -2.7596723198, -2.6278798129, -2.4642513412, -2.2932546017, -2.104763137, -1.9092932795, -1.7268907885, -1.5321244798, -1.3013333364, -1.0800814669, -0.8946120373, -0.7156178747, -0.5455811313, -0.3798420306, -0.2095958438, -0.0556881523, 0.0780773217, 0.2139402705, 0.3513717176, 0.4446574481, 0.5139486779, 0.5978150343, 0.6481670006, 0.68309561, 0.743464724, 0.787912879, 0.8220694637, 0.8638714462, 0.8959168556, 0.9255030892, 0.9591787158, 1.0005990197, 1.0380740656, 1.0662599313, 1.0952656065, 1.1127917529, 1.1393252856, 1.1776013288, 1.2124967153, 1.2550358399, 1.2836087519, 1.30386811, 1.3198303693, 1.3414071963, 1.3857324875, 1.4147139727, 1.4534297434, 1.4955535294, 1.5147674008, 1.5446546856, 1.562123931, 1.5929838786, 1.6426011982, 1.6694275049, 1.6997928763, 1.7300219991, 1.7523872885, 1.7703982039, 1.7988860635, 1.8362492841, 1.8599492876, 1.8931105242, 1.9171820762, 1.9222847918, 1.9269553175, 1.9387641941, 1.9600285483, 1.96429516, 1.9771565048, 1.9884033566, 1.9722736007, 1.9566550964, 1.9348746997, 1.9250335555, 1.9208138992, 1.9047329813, 1.8862271962, 1.8515824553, 1.8095694171, 1.7670140577, 1.7361463663, 1.7015552345, 1.6584986861, 1.6201244543, 1.5539987809, 1.4978009028, 1.4471995202, 1.3778654357, 1.3348993481, 1.2880226286, 1.234090527, 1.1741383808, 1.0921286164, 1.0299568687, 0.9760944505, 0.9179956068, 0.8741842316, 0.8375400586, 0.7850322207, 0.7197856048, 0.6714974468, 0.6229558407, 0.5739969926, 0.5447471398, 0.5110144225, 0.467658539, 0.4293798736, 0.389908254, 0.3384270438, 0.2985597043, 0.2851381919, 0.2644359217, 0.2297114506, 0.1979555883, 0.1690717736, 0.143933084, 0.1211728115, 0.1101124804, 0.1083489265, 0.0886562885, 0.0642862632, 0.0477833449, 0.0325277511, 0.0283580706, 0.0202046872, 0.0154918197, 0.0199464148, 0.0080690751, -0.0124979707, -0.0312652929, -0.0342754403, -0.0370193853, -0.0394996954, -0.0212682988, -0.0313147979, -0.0475181364, -0.0436229192, -0.0528475762, -0.054752339, -0.0468753893, -0.0299698756, -0.026031594, -0.0406886872, -0.0393150923, -0.0510275461, -0.0570168374, -0.038901182, -0.0323989227, -0.026740332, -0.0264524247, -0.0353596785, -0.0354767505, -0.0341994243, -0.0349108594, -0.0229486345, -0.0149445772, -0.0200858632, -0.0152767164, -0.0241456974, -0.0331818956, -0.0152226977, -0.0027970523, 0.0054367035, 0.0018113513, -0.009393911, -0.0103493363, -0.0220051782, -0.0306194856, -0.0242149704, -0.0076051727, 0.0063365694, -0.0072840998, -0.0288078786, -0.0356396895, -0.0348315691, -0.0307222422, -0.0255561813, -0.0267262029, -0.0335515426, -0.0431196734, -0.0558888998, -0.0604330562, -0.0529467259, -0.0457870381, -0.0458275948, -0.0531314686, -0.0717108283, -0.0847430681, -0.0842169887, -0.0873804951, -0.0791456597, -0.0775468298, -0.0965173804, -0.1086301141, -0.122604781, -0.1212632408, -0.1124573177 ];
    var beforeSignal=[ 1.2616115281, 1.3129386711, 1.3534079344, 1.3902885573, 1.4247405847, 1.4470454199, 1.4766336588, 1.5102753081, 1.5481503153, 1.5939074485, 1.6358882688, 1.6643882826, 1.6895110111, 1.712923497, 1.7290884422, 1.7676399419, 1.8153190456, 1.8460500283, 1.8752896728, 1.8913601791, 1.8995357484, 1.9163421025, 1.9274888202, 1.935865166, 1.9606141415, 1.9744528883, 1.9555285829, 1.95643099, 1.9626829253, 1.9430625962, 1.9428723216, 1.9433261862, 1.9255372077, 1.9021119224, 1.8681993746, 1.8392795525, 1.8064404365, 1.7761448689, 1.7604586285, 1.7261172514, 1.6745869661, 1.6311945633, 1.5858833867, 1.5231941726, 1.4707020777, 1.4387454876, 1.3866266518, 1.3274423953, 1.2826670106, 1.2224789306, 1.1559253739, 1.0970625565, 1.0460950008, 1.0083573592, 0.9581901607, 0.8990093755, 0.8357648747, 0.7704137204, 0.7306260181, 0.6860242469, 0.6395026388, 0.60806605, 0.5554189503, 0.5035181844, 0.4626106543, 0.4205363186, 0.3882981945, 0.3591202673, 0.3251177898, 0.282999884, 0.2482512453, 0.2108944085, 0.1718156665, 0.1587516877, 0.149988593, 0.1381982314, 0.1136137486, 0.0837438246, 0.0686973164, 0.037719454, 0.0200120282, 0.0292481596, 0.0250465598, 0.0108173024, -0.0072783169, -0.0155139304, -0.0200986486, -0.0333880875, -0.0357662993, -0.0362706937, -0.0428753492, -0.0529392448, -0.0701828714, -0.071961491, -0.0635847548, -0.0702722026, -0.0646945382, -0.0551502635, -0.0702826916, -0.0757002743, -0.07604811, -0.0858589392, -0.0804372136, -0.067780288, -0.0650581961, -0.0695281331, -0.0697632045, -0.0738652227, -0.0835926867, -0.0842809686, -0.0746029089, -0.0569383817, -0.0563326412, -0.0625000936, -0.0590666992, -0.0675002498, -0.069847572, -0.0618164234, -0.0468769873, -0.0332525922, -0.0382849045, -0.0395472313, -0.0400901683, -0.0403641449, -0.0400746667, -0.0331294578, -0.0125297302, -0.0263094465, -0.0397986621, -0.0299422471, -0.0358932217, -0.0242830258, -0.0139853323, -0.0210980343, -0.020060552, -0.0286362108, -0.0284051795, -0.0236904646, -0.0357622542, -0.0313622122, -0.0145648388, -0.0179132101, -0.0314296635, -0.0405119833, -0.0473497063, -0.0426226807, -0.0349021372, -0.0389776936, -0.0442349215, -0.0450745714, -0.04724443, -0.0661025197, -0.0799324226, -0.0670590634, -0.059946911, -0.0607604009, -0.0733596655, -0.0936544372, -0.094906458, -0.099146087, -0.0980019107, -0.0941844773, -0.1047679723, -0.1044785176, -0.1163373212, -0.134026521, -0.1381341236, -0.1412238087, -0.1263081348, -0.1218264573, -0.1357500789, -0.1437872514, -0.1535399676, -0.1529390918, -0.1491671037, -0.1500777295, -0.1501312182, -0.1543912053, -0.1584142698, -0.1648706234, -0.1748572174, -0.1799858528, -0.1689123908, -0.1638414023, -0.1769903458, -0.1826339746, -0.1882326939, -0.1889149937, -0.1849702826, -0.1853306311, -0.1832025271, -0.1922681952, -0.1929575063, -0.1916473175, -0.2060628139, -0.2102771117, -0.2067563449, -0.2007416294, -0.202932067, -0.2120631816, -0.2152251819, -0.2194383785, -0.2240845021, -0.2225046158, -0.2068171682, -0.2087080856, -0.2200656595, -0.2147201585, -0.229383624, -0.2367078344, -0.2236871769, -0.2192004355, -0.2146074164, -0.2146425833, -0.2185332893, -0.2235644962, -0.2250794652, -0.2249516151, -0.2190117529, -0.2143861071, -0.2212229538, -0.2129801115, -0.2272127964, -0.2466773351, -0.2337600074, -0.2304614504, -0.2179270833, -0.2209025343, -0.2333361546, -0.2308479413, -0.2462010408, -0.23681176, -0.2290409825, -0.2226898124, -0.203050532, -0.2234989661, -0.2289913152, -0.2286171543, -0.241540908, -0.2279871658, -0.2136862147, -0.2018209983, -0.206581541, -0.2152341696, -0.2100202966, -0.2105075818, -0.1918655561, -0.1606902149, -0.1379795861, -0.13412304, -0.1482724904, -0.1429542989, -0.1094347265, -0.031710241, 0.1552077223, 0.4640826536 ];
    var wholeSignal = [...beforeSignal,...signal];
    return wholeSignal ;
}
Plotly.plot('chart',[{
    y:getData(),
    type:'line',
    line: {
        color: 'blue',
        width: 2
    }
}]);