$('#pagination').pagination({
      dataSource: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
      // dataSource: 'http://localhost:5000/admin/quan-ly-am-thuc?page=',
      // locator: 'amthucs',
      // totalNumber: 27,
      pageSize: 10,
      
      afterPageOnClick: function(event, pageNumber) {
            loadPage(pageNumber);
      },
      afterPreviousOnClick: function(event, pageNumber) {
            
            loadPage(pageNumber);
      },
      afterNextOnClick: function(event, pageNumber) {
            
            loadPage(pageNumber);
      }
})

function loadPage(page) {
      window.location.assign = '/admin/quan-ly-am-thuc?page='+page;
      
}