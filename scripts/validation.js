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
    let radioErrorDiv = document.querySelector('#radio-error');
    for (let eachSurvey of survey) {
        if (eachSurvey.checked === true) {
            radio = eachSurvey.value;
            unselectedRadio = false;
            radioErrorDiv.innerHTML = '';
            radioErrorDiv.style.backgroundColor = "#4c8f77"
            break;
        } else if (eachSurvey.checked === false) {
            unselectedRadio = true;
        }
    }

    if (unselectedRadio) {
        radioErrorDiv.innerHTML = '';
        radioErrorDiv.style.display = "block";
        radioErrorDiv.innerHTML += '<p>Please select at least one button</p>'
        }

    if (nameNotProvided || invalidEmail || contactNumberNotProvided) {
        let errorDiv = document.querySelector('#error');
        errorDiv.innerHTML = '';
        errorDiv.style.display = "block";
        errorDiv.style.backgroundColor = "tomato";

        if (nameNotProvided) {
            errorDiv.innerHTML += '<p>Please provide your name</p>'
        } else {
            errorDiv.style.backgroundColor = "#4c8f77"
        }

        if (invalidEmail) {
            errorDiv.innerHTML += '<p>Your email should contain at least one "." and one "@"</p>'
        } else {
            errorDiv.style.backgroundColor = "#4c8f77"
        }

        if (contactNumberNotProvided) {
            errorDiv.innerHTML += '<p>Please provide your contact number</p>'
        } else {
            errorDiv.style.backgroundColor = "#4c8f77"
        }
    }

})