((window, document, $) => {
  $(() => {
    function onLoadEnd(evt) {
      $.post('/payslips', { payslips: evt.target.result })
      .done((data) => {
        if (data.failedNames.length) {
          const failedNames = data.failedNames.join('\n');
          alert(`Payslips failed to generate for the following names:\n${failedNames}`);
        } else {
          alert('All data uploaded successfully');
        }
      })
      .fail((error) => {
        alert(error.message);
      });
    }

    const buttonElement = document.getElementById('submit');
    buttonElement.onclick = () => {
      const file = document.getElementById('selectFile').files[0];
      if (file) {
        if (file.type === 'text/csv') {
          const reader = new FileReader();
          reader.readAsText(file, 'UTF-8');
          reader.onloadend = onLoadEnd;
        } else {
          alert('Incorrect file type chosen');
        }
      } else {
        alert('No file chosen');
      }
    };
  });
})(window, document, jQuery);