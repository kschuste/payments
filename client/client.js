((document, $) => {
  $(() => {
    function onLoadEnd(evt) {
      $.post('/payslips', { payslips: evt.target.result })
      .done((response) => {
        if (response) {
          alert(response.message);
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
})(document, jQuery);
