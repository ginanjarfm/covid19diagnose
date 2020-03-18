import 'bootstrap';
import _ from 'lodash';
import './scss/app.scss';

window.data = {};
window.result = {};

window.inputChanged = function(el) {
  switch (el.id) {
    case "fever":
      data.fever = true;
      break;
    case "no_fever":
      data.fever = false;
      break;
    case "cough":
      data.cough = el.checked;
      break;
    case "cold":
      data.cold = el.checked;
      break;
    case "sore_throat":
      data.sore_throat = el.checked;
      break;
    case "breath_problem":
      data.breath_problem = el.checked;
      break;
    case "sure":
      data.sure = true;
      break;
    case "not_sure":
      data.sure = false;
      break;
    case "abroad":
      data.abroad = true;
      break;
    case "not_abroad":
      data.abroad = false;
      break;
    case "visiting":
      data.visiting = true;
      break;
    case "not_visiting":
      data.visiting = false;
      break;
    case "contact":
      data.contact = true;
      break;
    case "not_contact":
      data.contact = false;
      break;
  }
  viewSection();
  showResult();
}

window.viewSection = function() {
  if (_.isEmpty(data)) {
    hideSection("section-2");
    hideSection("section-2-1");
    hideSection("section-3");
    hideSection("section-4");
    hideSection("section-5");

    hideSection("label-fever");
    hideSection("label-symptoms");
    hideSection("label-abroad");
    hideSection("label-visiting");
    hideSection("label-contact");
    hideSection("label-result");

    hideSection("conclusion");
  }

  if (data.cough || data.cold || data.sore_throat || data.breath_problem) {
    showSection("section-2-1");
  } else {
    hideSection("section-2-1");
  }

  if (_.has(data, "fever")) {
    showSection("label-fever");
    setHtml("data-fever", data.fever ? "Iya" : "Tidak");
  }

  if (data.cough || data.cold || data.sore_throat || data.breath_problem) {
    showSection("label-symptoms");
    let symptoms = [];
    if (data.cough) symptoms.push("Batuk");
    if (data.cold) symptoms.push("Pilek");
    if (data.sore_throat) symptoms.push("Sakit tenggorokan");
    if (data.breath_problem) symptoms.push("Sesak napas");
    setHtml("data-symptoms", symptoms.join(", "));
  } else {
    hideSection("label-symptoms");
  }

  if (_.has(data, "abroad")) {
    showSection("label-abroad");
    setHtml("data-abroad", data.abroad ? "Iya" : "Tidak");
  }

  if (_.has(data, "visiting")) {
    showSection("label-visiting");
    setHtml("data-visiting", data.visiting ? "Iya" : "Tidak");
  }

  if (_.has(data, "contact")) {
    showSection("label-contact");
    setHtml("data-contact", data.contact ? "Iya" : "Tidak");
  }
}

window.showResult = function() {
  const hasSymptoms = data.cough || data.cold || data.sore_throat;
  const hasVisit = data.abroad || data.visiting;
  const pdp_1 = data.fever && hasSymptoms && data.breath_problem && hasVisit;
  const pdp_2 = (data.fever || hasSymptoms) && data.contact;
  const odp_1 = (data.fever || hasSymptoms) && hasVisit;
  const odp_2 = hasVisit || data.contact;

  hideAllResult();
  if (_.has(data, "sure") && !data.sure) {
    showSection("unsure");
    result = "unsure";
  } else  {
    if (pdp_1 || pdp_2) {
      if (pdp_1) {
        showSection("pdp_1");
      } else {
        showSection("pdp_2");
      }
      result = "pdp";
    } else if (odp_1 || odp_2) {
      if (odp_1) {
        showSection("odp_1");
      } else {
        showSection("odp_2");
      }
      result = "odp";
    } else {
      showSection("none");
      result = "none";
    }
  }

  printResult();
}

window.hideAllResult = function() {
  hideSection("unsure");
  hideSection("pdp_1");
  hideSection("pdp_2");
  hideSection("odp_1");
  hideSection("odp_2");
  hideSection("none");
}

window.printResult = function() {
  showSection("label-result");
  setHtml("data-result", _.upperCase(result));
}

window.next = function(section) {
  switch (section) {
    case "section-2":
      if (!_.has(data, "fever")) {
        alert("Mohon lengkapi jawaban");
        return;
      }
      hideSection("section-1");
      showSection("section-2");
      break;
    case "section-3":
      if (data.cough || data.cold || data.sore_throat || data.breath_problem) {
        if (!_.has(data, "sure")) {
          alert("Mohon lengkapi jawaban");
          return;
        }
      }
      hideSection("section-2");
      showSection("section-3");
      break;
    case "section-4":
      if (!_.has(data, "abroad")) {
        alert("Mohon lengkapi jawaban");
        return;
      }
      hideSection("section-3");
      showSection("section-4");
      break;
    case "section-5":
      if (!_.has(data, "visiting")) {
        alert("Mohon lengkapi jawaban");
        return;
      }
      hideSection("section-4");
      showSection("section-5");
      break;
  }
}

window.prev = function(section) {
  switch (section) {
    case "section-1":
      hideSection("section-2");
      showSection("section-1");
      break;
    case "section-2":
      hideSection("section-3");
      showSection("section-2");
      break;
    case "section-3":
      hideSection("section-4");
      showSection("section-3");
      break;
    case "section-4":
      hideSection("section-5");
      showSection("section-4");
      break;
  }
}

window.diagnose = function() {
  showSection("conclusion");
  hideSection("section-5");
}

window.hideSection = function(id) {
  window.document.getElementById(id).style.display = "none";
}

window.showSection = function(id) {
  window.document.getElementById(id).style.display = "block";
}

window.setHtml = function(id, val) {
  showSection(id);
  document.getElementById(id).innerHTML = val;
}

viewSection();