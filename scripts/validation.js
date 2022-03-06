document.querySelector('#submit-btn').addEventListener('click', () => {
    let nameNotProvided = false;
    let invalidEmail = false
    let contactNumberNotProvided = false;
    let unselectedRadio = false;

    let name = document.querySelector('#name').value;
    if (!name) {
        nameNotProvided = true;
    }

    let email = document.querySelector('#email').value;
    if (!email.includes('.') || !email.includes('@')) {
        invalidEmail = true;
    }

    let contactNumber = document.querySelector('#contact-number').value;
    if (!contactNumber) {
        contactNumberNotProvided = true;
    }

    let radio = null
    let survey = document.querySelectorAll('.survey');
    for (let eachSurvey of survey) {

        if (eachSurvey.checked == true) {
            radio = eachSurvey.value;
            break;
        } else if (!eachSurvey.checked == true) {
            unselectedRadio = true;
            console.log(unselectedRadio)
        }

        if (unselectedRadio) {
            let radioErrorDiv = document.querySelector('#radio-error');
            radioErrorDiv.innerHTML = '';
            radioErrorDiv.style.display = "block";
            radioErrorDiv.innerHTML += '<p>Please select at least one button</p>'
        }
    }

    if (nameNotProvided || invalidEmail || contactNumberNotProvided || unselectedRadio) {
        let errorDiv = document.querySelector('#error');
        errorDiv.innerHTML = '';
        errorDiv.style.display = "block";

        if(nameNotProvided) {
            errorDiv.innerHTML += '<p>Please provide your name</p>'
        }

        if (invalidEmail) {
            errorDiv.innerHTML += '<p>Your email should contain at least one "." and one "@"</p>'
        }

        if(contactNumberNotProvided) {
            errorDiv.innerHTML += '<p>Please provide your contact number</p>'
        }
    }

})