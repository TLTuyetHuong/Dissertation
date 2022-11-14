const thang1 = document.getElementById('Thang1').getAttribute('data-bs-id');
const thang2 = document.getElementById('Thang2').getAttribute('data-bs-id');
const thang3 = document.getElementById('Thang3').getAttribute('data-bs-id');
const thang4 = document.getElementById('Thang4').getAttribute('data-bs-id');
const thang5 = document.getElementById('Thang5').getAttribute('data-bs-id');
const thang6 = document.getElementById('Thang6').getAttribute('data-bs-id');
const thang7 = document.getElementById('Thang7').getAttribute('data-bs-id');
const thang8 = document.getElementById('Thang8').getAttribute('data-bs-id');
const thang9 = document.getElementById('Thang9').getAttribute('data-bs-id');
const thang10 = document.getElementById('Thang10').getAttribute('data-bs-id');
const thang11 = document.getElementById('Thang11').getAttribute('data-bs-id');
const thang12 = document.getElementById('Thang12').getAttribute('data-bs-id');
const ctx = document.getElementById('myChart').getContext('2d');
const data = [thang1,thang2,thang3,thang4,thang5,thang6,thang7,thang8,thang9,thang10,thang11,thang12];
const labels = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'TỔNG SỐ TIỀN THEO THÁNG',
            data: data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true
    }
});