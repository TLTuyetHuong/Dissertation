document.addEventListener('DOMContentLoaded', function(){
      var ddID;
      var deleteForm = document.forms['form-dd-delete'];
      var containerForm = $('form[name="container-form"]');

      var checkboxAll = $('#checkbox-all');
      var itemCheckbox = $('input[name="goiyIds[]"]');
      var checkAllSubmitBtn = $('.check-all-submit-btn');
      var deleteForm = document.forms['form-dd-delete'];
      var restoreForm = document.forms['form-dd-restore'];

      var btnDelete = document.getElementById('btn-delete');

      var restoreBtn = $('.btn-restore');

      $('#modalDelete').on('show.bs.modal', event => {
            // Button that triggered the modal
            var button = event.relatedTarget
            // Extract info from data-bs-* attributes
            ddID = button.getAttribute('data-bs-id')
      });

      btnDelete.onclick = function () {
            deleteForm.action = '/admin/quan-ly-goi-y/' + ddID + '/force?_method=DELETE'; 
            deleteForm.submit();
      }

      // Restore btn clicked
      restoreBtn.click( function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            restoreForm.action = '/admin/quan-ly-goi-y/' + id + '/khoi-phuc?_method=PATCH'; 
            restoreForm.submit();
      });

      // Checkbox all click
      checkboxAll.change(function () {
            var isCheckedAll = $(this).prop('checked');
            itemCheckbox.prop('checked', isCheckedAll);
            renderCheckAllSubmitBtn();
      });

      // item checkbox changed
      itemCheckbox.change( function () {
            var isCheckedAll = itemCheckbox.length === $('input[name="goiyIds[]"]:checked').length;
            checkboxAll.prop('checked', isCheckedAll);
            renderCheckAllSubmitBtn();
      });

      function renderCheckAllSubmitBtn() {
            var checkedCount = $('input[name="goiyIds[]"]:checked').length;
            if(checkedCount > 0){
                  checkAllSubmitBtn.attr('disabled', false);
            } else {
                  checkAllSubmitBtn.attr('disabled', true);
            }
      }
})