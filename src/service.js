import axios from 'axios';

export async function getSurvey() {
    return await axios.get('http://localhost:8080/api/surveys');
}

export async function getMyAnswers() {
    return await axios.get('http://localhost:8080/api/getMyAnswers');
}

export async function saveSurvey(myAnswers) {
    myAnswers = myAnswers.map(iter => iter = {question_id:iter.id, category:iter.category,answer:iter.answer,id:iter.objectId});
    return await axios.post('http://localhost:8080/api/saveAnswers',myAnswers);
}

export async function saveStatus(category) {
    return await axios.get('http://localhost:8080/api/saveStatus?categoryName='+category);
}

export async function getStatus() {
    return await axios.get('http://localhost:8080/api/getStatus');
}



