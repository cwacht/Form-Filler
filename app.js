const { PDFDocument } = PDFLib

//NOTE: NOT using the "fields" object
const FORM_PATH = "./forms/"
const FORM_MAP = {
  "fields": [
    {
      "name": "name_first",
      "type": "text"
    },
    {
      "name": "name_middle",
      "type": "text"
    },
    {
      "name": "name_last",
      "type": "text"
    },
  ],
  "forms": [
    {
      "name": "SS-5",
      "url": "./ss-5-unlocked.pdf",
      "fields": [
        {
          "id_pdf": "topmostSubform[0].Page5[0].P5_firstname_FLD[0]",
          "ids": ["Name_First"]
        },
        {
          "id_pdf": "topmostSubform[0].Page5[0].P5_Middlename_FLD[0]",
          "ids": ["Name_Middle"]
        },
        {
          "id_pdf": "topmostSubform[0].Page5[0].P5_LastName_FLD[0]",
          "ids": ["Name_Last"]
        }
      ]
    },
    {
      "name": "Drivers-License_Virginia_Form-DL-1P",
      "url": "./Drivers-License_Virginia_Form-DL-1P.pdf",
      "fields": [
        {
          "name": "full_legal_name",
          "id_pdf": "form1[0].PrimaryPage[0].Applicant_Info[0].BasicInfo[0].LegalName[0]",
          "ids": ["Name_Last", "Name_First", "Name_Middle"]
        }
      ]
    }
  ]
}

function fillForms() {
  FORM_MAP.forms.forEach(form => {
    fillForm(form);
  })
}

async function fillForm(formData) {
  const formPdfBytes = await fetch(FORM_PATH + formData.url).then(res => res.arrayBuffer())
  const pdfDoc = await PDFDocument.load(formPdfBytes, { ignoreEncryption: true })
  const form = pdfDoc.getForm()
  formData.fields.forEach(field => {
    let value = ""
    field.ids.forEach(id => {
      value += document.getElementById(id).value + " ";
    })
    form.getTextField(field.id_pdf).setText(value);
  })
  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, formData.name + "_Filled.pdf", "application/pdf");
}

function download(data, filename, type) {
  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
  }
}