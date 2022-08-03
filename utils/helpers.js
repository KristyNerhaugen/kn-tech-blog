module.exports = {
  // helper function to make dates readable in MM/DD/YYY format
  format_date: (date) => {
    return `${new Date(date).getMonth() + 1}/${new Date(
      date
    ).getDate()}/${new Date(date).getFullYear()}`;
  },

  // helper function to have words "post" and "comment" only pluralized when necessary
  format_plural: (word, amount) => {
    if (amount !== 1) {
      return `${word}s`;
    }
    return word;
  },
};
