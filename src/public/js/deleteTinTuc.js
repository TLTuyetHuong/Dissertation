document.addEventListener('DOMContentLoaded', function(){
      var ddID;
      var deleteForm = document.forms['form-dd-delete'];
      var btnDelete = document.getElementById('btn-delete');

      $('#modalDelete').on('show.bs.modal', event => {
            // Button that triggered the modal
            var button = event.relatedTarget
            // Extract info from data-bs-* attributes
            ddID = button.getAttribute('data-bs-id')
      });

      btnDelete.onclick = function () {
            deleteForm.action = '/admin/quan-ly-tin-tuc/' + ddID + '?_method=DELETE'; 
            deleteForm.submit();
    }
})