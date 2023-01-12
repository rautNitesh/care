window.addEventListener("load", () => {
  var message = document.getElementById("textarea")
  var firstname = document.getElementById("firstname")
  var lastname = document.getElementById("lastname")
  var email = document.getElementById("email")
  var phone = document.getElementById("phone")
  var refer = document.getElementById("refer")
  var website = document.getElementById("website")
  checkForChange(firstname)
  checkForChange(lastname)
  checkForChange(email)
  checkForChange(phone)
  checkForChange(refer)
  checkForChange(website)
  checkForChange(message)
})

// runs when send message button is pressed
async function toRunOnSubmit() {
  var submitBtn = document.getElementById("submit")
  var message = document.getElementById("textarea")
  var firstname = document.getElementById("firstname")
  var lastname = document.getElementById("lastname")
  var email = document.getElementById("email")
  var phone = document.getElementById("phone")
  var refer = document.getElementById("refer")
  var website = document.getElementById("website")

  submitBtn.innerHTML = "Processing..."
  grecaptcha.ready(function () {
    grecaptcha
      .execute("6Le4nvkiAAAAAINUL78iR_1lrKyqRNzmoWraNCKW", { action: "index" })
      .then(function (token) {
        const fd = new FormData()
        fd.append("first_name", firstname.value)
        fd.append("last_name", lastname.value)
        fd.append("email", email.value)
        fd.append("phone", phone.value)
        fd.append("website", website.value)
        fd.append("option", refer.value)
        fd.append("message", message.value)
        fd.append("responseKey", token)
        fetch("https://wdnepal.com/demo/rola/mail/rolaform.php/", {
          method: "POST",
          body: fd,
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res)
            if (!!res.success) {
              scrollToContactForm("contactForm") // Passing contact section id to scroll to the top of the form to display message
              document.getElementById("thankyou").innerText = res.message
              firstname.value = ""
              lastname.value = ""
              email.value = ""
              phone.value = ""
              website.value = ""
              refer.value = "selectOne"
              message.value = ""
            } else {
              if (res.payload === "first_name") {
                addErrorAndFocus(firstname)
                return
              }
              if (res.payload === "last_name") {
                addErrorAndFocus(lastname)
                return
              }

              if (res.payload === "option") {
                addErrorAndFocus(refer)
                return
              }
              if (res.payload === "message") {
                addErrorAndFocus(message)
                return
              }
              if (res.payload === "email") {
                addErrorAndFocus(email)
                return
              }
              if (res.payload === "phone") {
                addErrorAndFocus(phone)
                return
              }
              if (res.payload === "website") {
                addErrorAndFocus(website)
                return
              }
            }
            document.getElementById("submit").innerHTML = "SEND MESSAGE"
          })
          .catch((err) => {
            document.getElementById("submit").innerHTML = "SEND MESSAGE"
          })
      })
      .catch(err=>console.log(err))
  })
}

// add error and focus when error occurs in the form
function addErrorAndFocus(element) {
  element.classList.add("error")
  element.focus()
  document.getElementById("submit").innerHTML = "SEND MESSAGE"
  return
}

// check if the element has change and remove error from it
function checkForChange(element) {
  element.addEventListener("change", () => {
    element.classList.remove("error")
  })
}

// On Submit
function onSubmit() {
  toRunOnSubmit()
}

//Scroll to Contact From Section
const scrollToFormLinks = document.getElementsByClassName("scrollToForm")
for (const link of scrollToFormLinks) {
  link.addEventListener("click", formOffsets)
}

function formOffsets(e) {
  e.preventDefault()
  const href = this.getAttribute("data-target")
  // document.getElementById("firstname").focus();
  scrollToContactForm(href)
}

function scrollToContactForm(target) {
  document.getElementById(target).scrollIntoView({
    behavior: "smooth",
  })
}

// Custom Accordion

function initAcc(elem, option) {
  document.addEventListener("click", function (e) {
    if (!e.target.matches(elem + " .accordion-header")) return
    else {
      if (!e.target.parentElement.classList.contains("active")) {
        if (option == true) {
          var elementList = document.querySelectorAll(elem + " .accordion-item")
          Array.prototype.forEach.call(elementList, function (e) {
            e.classList.remove("active")
          })
        }
        e.target.parentElement.classList.add("active")
      } else {
        e.target.parentElement.classList.remove("active")
      }
    }
  })
}

//activate accordion function
initAcc(".accordion", true)
$(document).ready(function () {
  $("body").openAccessibility({
    localization: ["en"],
    maxZoomLevel: 3,
    minZoomLevel: 0.5,
    zoomStep: 0.2,
    zoom: 1,
  })
})
