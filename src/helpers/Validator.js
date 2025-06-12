
function isPasswordValid(rawPassword) {
    // At least 8 characters long
    // An uppercase
    // A number
    // A special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(rawPassword);
}

function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


const Validator = {
    isPasswordValid,
    isEmailValid,
}

export default Validator;