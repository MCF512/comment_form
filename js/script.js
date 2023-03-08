const form = document.forms.commentForm;
const commentField = document.querySelector('.comment_field');
const nameInp = document.querySelector('#name');
const dataInp = document.querySelector('#date');
const commentInp = document.querySelector('#comment');
const submitBtn = document.querySelector('#submit__btn');

console.log(form.submit)
// console.log('gadsas')
// console.log(submitBtn)
submitBtn.addEventListener('click', (e) => {
  e.preventDefault()
  console.log(e.target.value)
})