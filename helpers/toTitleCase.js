// Titlecase a string
// From: https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
const toTitleCase = (str) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

export default toTitleCase;
